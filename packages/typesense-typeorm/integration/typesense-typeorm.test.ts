import { INestApplication }                  from '@nestjs/common'
import { Test }                              from '@nestjs/testing'
import { GenericContainer }                  from 'testcontainers'
import { StartedTestContainer }              from 'testcontainers'
import { Wait }                              from 'testcontainers'
import { getRepositoryToken }                from '@nestjs/typeorm'
import { TYPESENSE_MODULE_OPTIONS }          from '@monstrs/nestjs-typesense'
import { Client }                            from 'typesense'
import { Repository }                        from 'typeorm'

import { TypesenseTypeOrmIntegrationModule } from './src'
import { TestEntity }                        from './src/test.entity'

jest.setTimeout(60000)

describe('typesense-typeorm', () => {
  let typesense: StartedTestContainer
  let repository: Repository<TestEntity>
  let client: Client
  let app: INestApplication

  beforeAll(async () => {
    typesense = await new GenericContainer('typesense/typesense:0.21.0')
      .withWaitStrategy(Wait.forLogMessage('Peer refresh succeeded!'))
      .withEnv('TYPESENSE_DATA_DIR', '/tmp')
      .withEnv('TYPESENSE_API_KEY', 'test')
      .withExposedPorts(8108)
      .start()

    const module = await Test.createTestingModule({
      imports: [TypesenseTypeOrmIntegrationModule],
    })
      .overrideProvider(TYPESENSE_MODULE_OPTIONS)
      .useValue({
        apiKey: 'test',
        nodes: [
          {
            host: 'localhost',
            protocol: 'http',
            port: typesense.getMappedPort(8108),
          },
        ],
      })
      .compile()

    app = module.createNestApplication()

    await app.init()

    repository = module.get(getRepositoryToken(TestEntity))
    client = module.get(Client)
  })

  afterAll(async () => {
    await app.close()
    await typesense.stop()
  })

  it(`find after create`, async () => {
    await repository.save(
      repository.create({
        company: 'Stark Corp',
        employees: 1031,
      })
    )

    const result = await client.collections('test').documents().search({
      q: 'Stark',
      query_by: 'company',
      filter_by: 'employees:>1000',
    })

    expect(result.found).toBe(1)
  })

  it(`find after update`, async () => {
    const entity = await repository.save(
      repository.create({
        company: 'Stark Corp',
        employees: 10,
      })
    )

    entity.employees = 1031

    await repository.save(entity)

    const result = await client.collections('test').documents().search({
      q: 'Stark',
      query_by: 'company',
      filter_by: 'employees:>1000',
    })

    expect(result.found).toBe(1)
  })
})