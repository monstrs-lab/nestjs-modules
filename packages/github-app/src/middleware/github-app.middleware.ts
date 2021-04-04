import { Inject }                                           from '@nestjs/common'
import { OnModuleInit }                                     from '@nestjs/common'
import { Injectable }                                       from '@nestjs/common'
import { HttpAdapterHost }                                  from '@nestjs/core'
import { Logger }                                           from '@monstrs/logger'
import { App }                                              from '@octokit/app'
import { createNodeMiddleware as createWebhooksMiddleware } from '@octokit/webhooks'

import { GITHUB_APP_MODULE_OPTIONS }                        from '../module'
import { GitHubAppModuleOptions }                           from '../module'

@Injectable()
export class GitHubAppMiddleware implements OnModuleInit {
  private readonly logger = new Logger(GitHubAppMiddleware.name)

  constructor(
    @Inject(GITHUB_APP_MODULE_OPTIONS)
    private readonly options: GitHubAppModuleOptions,
    private readonly adapterHost: HttpAdapterHost,
    private readonly app: App
  ) {}

  async onModuleInit() {
    if (this.adapterHost.httpAdapter.getType() === 'express') {
      const instance = this.adapterHost.httpAdapter.getInstance()

      if (this.options.webhooks) {
        instance.post(
          '/api/github/webhooks',
          createWebhooksMiddleware(this.app.webhooks, {
            path: '/api/github/webhooks',
            log: this.logger,
          })
        )
      }
    } else {
      throw new Error('Only express engine available')
    }
  }
}
