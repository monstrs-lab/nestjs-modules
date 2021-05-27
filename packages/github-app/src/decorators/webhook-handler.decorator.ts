import { SetMetadata, applyDecorators } from '@nestjs/common'
import { EmitterWebhookEventName }      from '@octokit/webhooks/dist-types/types'

import { WebhookHandlerParamType }      from './webhook-handler-param.type'
import { assignMetadata }               from './param.utils'

export const WEBHOOK_HANDLER_ARGS_METADATA = '__webhookHandlerArguments__'
export const WEBHOOK_HANDLER_METADATA = '__webhookHandler__'

export const createWebhookHandlerParamDecorator =
  (paramtype: WebhookHandlerParamType): ParameterDecorator =>
  (target, key, index) => {
    const args = Reflect.getMetadata(WEBHOOK_HANDLER_ARGS_METADATA, target.constructor, key) || {}

    Reflect.defineMetadata(
      WEBHOOK_HANDLER_ARGS_METADATA,
      assignMetadata(args, paramtype, index),
      target.constructor,
      key
    )
  }

export interface WebhookHandlerMetadata {
  name: EmitterWebhookEventName
}

export const WebhookHandler = (name: EmitterWebhookEventName): MethodDecorator =>
  applyDecorators(SetMetadata(WEBHOOK_HANDLER_METADATA, { name }))
