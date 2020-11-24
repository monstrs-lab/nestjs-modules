import { Inject }                           from '@nestjs/common'
import { OnModuleInit }                     from '@nestjs/common'
import { Injectable }                       from '@nestjs/common'
import { HttpAdapterHost }                  from '@nestjs/core'

import { EXTERNAL_RENDERER_MODULE_OPTIONS } from '../module'
import { ExternalRendererModuleOptions }    from '../module'
import { ExpressExternalRendererView }      from './express-external-renderer.view'

@Injectable()
export class ExternalRenderer implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @Inject(EXTERNAL_RENDERER_MODULE_OPTIONS)
    private readonly options: ExternalRendererModuleOptions
  ) {}

  async onModuleInit() {
    if (this.adapterHost.httpAdapter.getType() === 'express') {
      const instance = this.adapterHost.httpAdapter.getInstance()

      instance.set('view', ExpressExternalRendererView)
      instance.set('views', this.options.url)

      this.adapterHost.httpAdapter.render = (response, view, options) => {
        return response.render(view, {
          data: options,
          headers: response.req.headers,
          query: response.req.query,
        })
      }
    } else {
      throw new Error('Only express engine available')
    }
  }
}
