import { Injectable }              from '@nestjs/common'
import { EmitterWebhookEventName } from '@octokit/webhooks/dist-types/types'
import { EmitterWebhookEvent }     from '@octokit/webhooks/dist-types/types'
import { Octokit }                 from '@octokit/core'

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
