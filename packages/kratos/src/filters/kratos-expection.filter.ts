import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

import { KratosRedirectRequiredException }       from '../exceptions'
import { KratosBrowserUrls }                     from '../urls'

@Catch(KratosRedirectRequiredException)
export class KratosExceptionFilter implements ExceptionFilter {
  constructor(private readonly urls: KratosBrowserUrls) {}

  catch(exception: KratosRedirectRequiredException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const url = this.urls.get(exception.redirectTo)

    response.redirect(url)
  }
}
