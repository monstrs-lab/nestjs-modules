/**
 * @jest-environment node
 */

import getPort                        from 'get-port'
import request                        from 'supertest'
import { INestApplication }           from '@nestjs/common'
import { Injectable }                 from '@nestjs/common'
import { Test }                       from '@nestjs/testing'

import { WebhookHandler }             from '../../src'
import { WebhookPayload }             from '../../src'
import { GitHubAppIntegrationModule } from '../src'

describe('github app webhooks', () => {
  let app: INestApplication
  let url: string

  const payload = jest.fn()

  @Injectable()
  class PullRequestHnadler {
    @WebhookHandler('pull_request')
    onPullRequest(@WebhookPayload data) {
      payload(data)
    }
  }

  beforeAll(async () => {
    const port = await getPort()

    const module = await Test.createTestingModule({
      imports: [GitHubAppIntegrationModule],
      providers: [PullRequestHnadler],
    }).compile()

    app = module.createNestApplication()

    await app.init()
    await app.listen(port, '0.0.0.0')

    url = await app.getUrl()
  })

  afterAll(async () => {
    await app.close()
  })

  it(`return content`, async () => {
    await request(url)
      .post('/api/github/webhooks')
      .send({ foo: 'bar' })
      .set('Accept', 'application/json')
      .set('x-github-event', 'pull_request')
      .set(
        'x-hub-signature-256',
        'sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3'
      )
      .set('x-github-delivery', 'test')
      .expect(200)

    expect(payload).toHaveBeenCalledWith({ foo: 'bar' })
  })
})
