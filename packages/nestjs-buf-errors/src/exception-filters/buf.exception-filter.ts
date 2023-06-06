import type { ArgumentsHost }        from '@nestjs/common'
import type { Observable }           from 'rxjs'

import { AssertionError }            from 'node:assert'

import { Catch }                     from '@nestjs/common'
import { BaseRpcExceptionFilter }    from '@nestjs/microservices'

import { assertionExceptionFactory } from '../exception-factories/index.js'

@Catch()
export class BufExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof AssertionError) {
      return super.catch(assertionExceptionFactory(exception), host)
    }

    return super.catch(exception, host)
  }
}
