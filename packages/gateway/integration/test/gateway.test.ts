import getPort                      from 'get-port'
import request                      from 'supertest'
import { Transport }                from '@nestjs/microservices'
import { INestApplication }         from '@nestjs/common'
import { INestMicroservice }        from '@nestjs/common'
import { Test }                     from '@nestjs/testing'
import { buildClientSchema }        from 'graphql'
import { printSchema }              from 'graphql'
import { getIntrospectionQuery }    from 'graphql'
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
        playground: true,
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
            transforms: {
              rename: {
                mode: 'bare',
                renames: [
                  {
                    from: {
                      type: 'tech_monstrs_(.*)',
                    },
                    to: {
                      type: '$1',
                    },
                    useRegExpForTypes: true,
                  },
                  {
                    from: {
                      type: 'Mutation',
                      field: 'tech_monstrs_ExampleService_(.*)',
                    },
                    to: {
                      type: 'Mutation',
                      field: '$1',
                    },
                    useRegExpForTypes: true,
                    useRegExpForFields: true,
                  },
                  {
                    from: {
                      type: 'Query',
                      field: 'tech_monstrs_ExampleService_(.*)',
                    },
                    to: {
                      type: 'Query',
                      field: '$1',
                    },
                    useRegExpForTypes: true,
                    useRegExpForFields: true,
                  },
                ],
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

  it('check schema', async () => {
    const res = await request(url).post('/').set('Accept', 'application/json').send({
      operationName: 'IntrospectionQuery',
      variables: {},
      query: getIntrospectionQuery(),
    })

    const schema = printSchema(buildClientSchema(res.body.data))

    expect(schema).toContain('getMovies(input: MovieRequest_Input): MoviesResult')
    expect(schema).toContain('GetMetadata(input: GetMetadataRequest_Input): GetMetadataResponse')
    expect(schema).toContain('GetError(input: GetErrorRequest_Input): GetErrorResponse')
    expect(schema).toContain(
      'GetMustRename(input: GetMustRenameRequest_Input): GetMustRenameResponse'
    )
  })

  it(`get movies`, async () => {
    await request(url)
      .post('/')
      .set('Accept', 'application/json')
      .send({
        operationName: 'Movies',
        variables: {},
        query: 'mutation Movies {\n  getMovies {\n    result {\n      name\n    }\n  }\n}\n',
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

  it(`get metadata`, async () => {
    await request(url)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', 'test')
      .send({
        operationName: 'Metadata',
        variables: {},
        query: 'mutation Metadata {\n  GetMetadata {\n    authorization  }\n}\n',
      })
      .expect(200, {
        data: {
          GetMetadata: {
            authorization: 'test',
          },
        },
      })
  })

  it('handle error', async () => {
    const response = await request(url)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', 'test')
      .send({
        operationName: 'Error',
        variables: {},
        query: 'mutation Error {\n  GetError {\n    result  }\n}\n',
      })

    expect(response.body.errors[0].extensions.exception).toEqual(
      expect.objectContaining({
        status: 'INVALID_ARGUMENT',
        code: 3,
        message: 'Test',
      })
    )
  })
})
