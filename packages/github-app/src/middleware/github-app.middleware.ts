import { Inject }                    from '@nestjs/common'
import { OnModuleInit }              from '@nestjs/common'
import { Injectable }                from '@nestjs/common'
import { HttpAdapterHost }           from '@nestjs/core'
import { createNodeMiddleware }      from '@octokit/app'
import { App }                       from '@octokit/app'

import { GITHUB_APP_MODULE_OPTIONS } from '../module'
import { GitHubAppModuleOptions }    from '../module'

@Injectable()
export class GitHubAppMiddleware implements OnModuleInit {
  constructor(
    @Inject(GITHUB_APP_MODULE_OPTIONS)
    private readonly options: GitHubAppModuleOptions,
    private readonly adapterHost: HttpAdapterHost,
    private readonly app: App
  ) {}

  async onModuleInit() {
    if (this.options.oauth) {
      if (this.adapterHost.httpAdapter.getType() === 'express') {
        const instance = this.adapterHost.httpAdapter.getInstance()

        instance.use(createNodeMiddleware(this.app))
      } else {
        throw new Error('Only express engine available')
      }
    }
  }
}
