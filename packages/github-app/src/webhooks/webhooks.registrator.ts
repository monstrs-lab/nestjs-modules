import { OnApplicationBootstrap }          from '@nestjs/common'
import { Injectable }                      from '@nestjs/common'
import { App }                             from '@octokit/app'

import { WebhookHandlingMetadataRegistry } from '../metadata'

@Injectable()
export class WebhooksRegistrator implements OnApplicationBootstrap {
  constructor(
    private readonly metadataRegistry: WebhookHandlingMetadataRegistry,
    private readonly app: App
  ) {}

  async onApplicationBootstrap() {
    this.metadataRegistry.getWebhookHandlers().forEach((handlers, name) => {
      this.app.webhooks.on(name, ({ octokit, payload }) =>
        Promise.all(handlers.map((handler) => handler(octokit, payload)))
      )
    })
  }
}
