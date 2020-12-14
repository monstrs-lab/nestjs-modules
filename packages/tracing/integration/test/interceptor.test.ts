/**
 * @jest-environment node
 */

import getPort                      from 'get-port'
import request                      from 'supertest'
import { INestApplication }         from '@nestjs/common'
import { Test }                     from '@nestjs/testing'

import { TracingIntegrationModule } from '../src'

describe('tracing interceptor', () => {
  let app: INestApplication
  let url: string

  beforeAll(async () => {
    const port = await getPort()

    const module = await Test.createTestingModule({
      imports: [TracingIntegrationModule],
    }).compile()

    app = module.createNestApplication()

    await app.init()
    await app.listen(port, '0.0.0.0')

    url = await app.getUrl()
  })

  afterAll(async () => {
    await app.close()
  })

  it(`intercept`, async () => {
    const response = await request(url).get('/interceptor/intercept').expect(200)

    expect(response.body.success).toBe(true)
  })
})
