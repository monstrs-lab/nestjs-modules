import { Injectable }              from '@nestjs/common'
import { Octokit }                 from '@octokit/core'
import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'
import { EmitterWebhookEvent }     from '@octokit/webhooks/dist-types/types'

type HandlerFunction = (octokit: Octokit, payload: EmitterWebhookEvent['payload']) => Promise<void>

@Injectable()
export class WebhookHandlingMetadataRegistry {
  private webhookHandlers: Map<EmitterWebhookEventName, Array<HandlerFunction>> = new Map()

  addWebhookHandler(name, handler: HandlerFunction) {
    if (!this.webhookHandlers.has(name)) {
      this.webhookHandlers.set(name, [])
    }

    this.webhookHandlers.get(name)?.push(handler)
  }

  getWebhookHandlers() {
    return this.webhookHandlers
  }
}
