import { EmitterWebhookEvent } from '@octokit/webhooks/dist-types/types'

export { EmitterWebhookEvent } from '@octokit/webhooks/dist-types/types'
export { Octokit } from '@octokit/core'

export type Payload = EmitterWebhookEvent['payload']

export * from './decorators'
export * from './module'
