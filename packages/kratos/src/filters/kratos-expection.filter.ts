import path                                      from 'path'
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Inject }                                from '@nestjs/common'

import { KratosRedirectRequiredException }       from '../exceptions'
import { KRATOS_MODULE_OPTIONS }                 from '../module'
import { KratosModuleOptions }                   from '../module'

@Catch(KratosRedirectRequiredException)
export class KratosExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(KRATOS_MODULE_OPTIONS)
    protected readonly options: KratosModuleOptions
  ) {}

  catch(exception: KratosRedirectRequiredException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const url = new URL(this.options.browser)

    url.pathname = path.join(url.pathname, exception.redirectTo)

    response.redirect(url.toString())
  }
}
