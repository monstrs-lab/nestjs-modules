import { WebhookHandlerParamType }            from './webhook-handler-param.type'
import { createWebhookHandlerParamDecorator } from './webhook-handler.decorator'

export const WebhookOctokit = createWebhookHandlerParamDecorator(WebhookHandlerParamType.OCTOKIT)
