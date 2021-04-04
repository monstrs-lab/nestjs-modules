import { Injectable }               from '@nestjs/common'
import { Reflector }                from '@nestjs/core'

import { WEBHOOK_HANDLER_METADATA } from '../decorators'
import { WebhookHandlerMetadata }   from '../decorators'

@Injectable()
export class WebhookHandlingMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getWebhookHandlerMetadata(target: Function): WebhookHandlerMetadata | undefined {
    return this.reflector.get(WEBHOOK_HANDLER_METADATA, target)
  }
}
