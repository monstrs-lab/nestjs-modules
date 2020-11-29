/**
 * @jest-environment node
 */

import getPort                            from 'get-port'
import request                            from 'supertest'
import { INestApplication }               from '@nestjs/common'
import { INestMicroservice }              from '@nestjs/common'
import { Test }                           from '@nestjs/testing'

import { GRPC_HTTP_PROXY_MODULE_OPTIONS } from '../../src'
import { GrpcHttpProxyIntegrationModule } from '../src'
import { serverOptions }                  from '../src'

describe('grpc http proxy', () => {
  let service: INestMicroservice
  let app: INestApplication
  let url: string

  beforeAll(async () => {
    const servicePort = await getPort()
    const appPort = await getPort()

    const module = await Test.createTestingModule({
      imports: [GrpcHttpProxyIntegrationModule],
    })
      .overrideProvider(GRPC_HTTP_PROXY_MODULE_OPTIONS)
      .useValue({
        ...serverOptions.options,
        url: `0.0.0.0:${servicePort}`,
      })
      .compile()

    service = module.createNestMicroservice({
      ...serverOptions,
      options: {
        ...serverOptions.options,
        url: `0.0.0.0:${servicePort}`,
      },
    })

    app = module.createNestApplication()

    await service.init()
    await app.init()

    await app.listen(appPort, '0.0.0.0')
    await service.listenAsync()

    url = await app.getUrl()
  })

  afterAll(async () => {
    await service.close()
    await app.close()
  })

  it(`get schema`, async () => {
    const response = await request(url).get('/grpc-proxy/schema').expect(200)

    const [test] = response.body.files

    expect(test.name).toBe('test.proto')
    expect(test.source).toBeDefined()
  })

  it(`call method`, async () => {
    const response = await request(url)
      .post('/grpc-proxy/call')
      .send({
        file: 'test.proto',
        service: 'test.TestService',
        method: 'test',
        request: {
          id: 'test',
        },
      })
      .set('Accept', 'application/json')
      .expect(200)

    expect(response.body.id).toBe('test')
  })
})
