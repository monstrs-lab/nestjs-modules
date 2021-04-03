import { Provider }                        from '@nestjs/common'
import { App }                             from '@octokit/app'

import { WebhookHandlingMetadataAccessor } from '../metadata'
import { WebhookHandlingMetadataExplorer } from '../metadata'
import { WebhookHandlingMetadataRegistry } from '../metadata'
import { GitHubAppMiddleware }             from '../middleware'
import { WebhooksRegistrator }             from '../webhooks'
import { GitHubAppModuleOptions }          from './github-app-module-options.interface'
import { GITHUB_APP_MODULE_OPTIONS }       from './github-app.constants'

export const createGitHubAppOptionsProvider = (options: GitHubAppModuleOptions): Provider[] => [
  {
    provide: GITHUB_APP_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createGitHubAppProvider = (): Provider[] => [
  GitHubAppMiddleware,
  WebhooksRegistrator,
  WebhookHandlingMetadataAccessor,
  WebhookHandlingMetadataExplorer,
  WebhookHandlingMetadataRegistry,
]

export const createGitHubAppExportsProvider = (): Provider[] => [
  {
    provide: App,
    useFactory: (options: GitHubAppModuleOptions) => new App(options),
    inject: [GITHUB_APP_MODULE_OPTIONS],
  },
]
