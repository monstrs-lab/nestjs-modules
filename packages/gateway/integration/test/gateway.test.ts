/**
 * @jest-environment jest-environment-node-single-context
 */

import getPort                      from 'get-port'
import request                      from 'supertest'
import { Transport }                from '@nestjs/microservices'
import { INestApplication }         from '@nestjs/common'
import { INestMicroservice }        from '@nestjs/common'
import { Test }                     from '@nestjs/testing'
import path                         from 'path'

import { GatewaySourceType }        from '../../src'
import { GATEWAY_MODULE_OPTIONS }   from '../../src'
import { GatewayIntegrationModule } from '../src'

describe('gateway', () => {
  let service: INestMicroservice
  let app: INestApplication
  let url: string

  beforeAll(async () => {
    const servicePort = await getPort()
    const appPort = await getPort()

    const module = await Test.createTestingModule({
      imports: [GatewayIntegrationModule],
    })
      .overrideProvider(GATEWAY_MODULE_OPTIONS)
      .useValue({
        sources: [
          {
            name: 'Movies',
            type: GatewaySourceType.GRPC,
            handler: {
              endpoint: `localhost:${servicePort}`,
              protoFilePath: {
                file: path.join(__dirname, '../src/service.proto'),
                load: { includeDirs: [] },
              },
              serviceName: 'ExampleService',
              packageName: 'tech.monstrs',
              metaData: {
                authorization: ['req', 'headers', 'authorization'],
              },
            },
          },
        ],
      })
      .compile()

    app = module.createNestApplication()

    service = module.createNestMicroservice({
      transport: Transport.GRPC,
      options: {
        package: ['tech.monstrs'],
        protoPath: [path.join(__dirname, '../src/service.proto')],
        url: `0.0.0.0:${servicePort}`,
        loader: {
          arrays: true,
          keepCase: true,
          defaults: true,
          oneofs: true,
          includeDirs: [],
        },
      },
    })

    await app.init()
    await service.init()

    await app.listen(appPort, '0.0.0.0')
    await service.listenAsync()

    url = await app.getUrl()
  })

  afterAll(async () => {
    await service.close()
    await app.close()
  })

  it(`get movies`, async () => {
    await request(url)
      .post('/')
      .set('Accept', 'application/json')
      .send({
        operationName: 'Movies',
        variables: {},
        query: 'query Movies {\n  getMovies {\n    result {\n      name\n    }\n  }\n}\n',
      })
      .expect(200, {
        data: {
          getMovies: {
            result: [
              {
                name: 'Mission: Impossible Rogue Nation',
              },
            ],
          },
        },
      })
  })

  it(`get movies`, async () => {
    await request(url)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', 'test')
      .send({
        operationName: 'Metadata',
        variables: {},
        query: 'query Metadata {\n  GetMetadata {\n    authorization  }\n}\n',
      })
      .expect(200, {
        data: {
          GetMetadata: {
            authorization: 'test',
          },
        },
      })
  })
})
