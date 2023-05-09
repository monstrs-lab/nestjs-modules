import { PromiseClient }              from '@bufbuild/connect'
import { ValidationError }            from '@monstrs/protobuf-rpc'
import { INestMicroservice }          from '@nestjs/common'
import { Test }                       from '@nestjs/testing'
import { ServerBufConnect }           from '@wolfcoded/nestjs-bufconnect'
import { ServerProtocol }             from '@wolfcoded/nestjs-bufconnect'
import { createPromiseClient }        from '@bufbuild/connect'
import { createGrpcTransport }        from '@bufbuild/connect-node'
import { afterAll }                   from '@jest/globals'
import { beforeAll }                  from '@jest/globals'
import { describe }                   from '@jest/globals'
import { expect }                     from '@jest/globals'
import { it }                         from '@jest/globals'
import getPort                        from 'get-port'

import { TestService }                from '../gen/test_connect.js'
import { BufErrorsIntegrationModule } from '../src/index.js'

describe('grpc error', () => {
  let service: INestMicroservice
  let client: PromiseClient<typeof TestService>

  beforeAll(async () => {
    const port = await getPort()

    const module = await Test.createTestingModule({
      imports: [BufErrorsIntegrationModule],
    }).compile()

    service = module.createNestMicroservice({
      strategy: new ServerBufConnect({
        protocol: ServerProtocol.HTTP2_INSECURE,
        port,
      }),
    })

    await service.init()
    await service.listen()

    client = createPromiseClient(
      TestService,
      createGrpcTransport({
        baseUrl: `http://localhost:${port}`,
        httpVersion: '2',
      })
    )
  })

  afterAll(async () => {
    await service.close()
  })

  it('validation errors', async () => {
    expect.assertions(1)

    try {
      await client.testValidation({ id: 'test', child: { id: 'test' } })
    } catch (error: any) {
      expect(error.details.map((detail) => ValidationError.fromBinary(detail.value))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'id',
            property: 'id',
            messages: expect.arrayContaining([
              expect.objectContaining({
                id: 'isEmail',
                constraint: 'id must be an email',
              }),
            ]),
          }),
          expect.objectContaining({
            id: 'child.id',
            property: 'id',
            messages: expect.arrayContaining([
              expect.objectContaining({
                id: 'isEmail',
                constraint: 'id must be an email',
              }),
            ]),
          }),
        ])
      )
    }
  })
})
