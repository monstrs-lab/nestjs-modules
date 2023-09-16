import type { ArgumentsHost }         from '@nestjs/common'
import type { Observable }            from 'rxjs'

import { AssertionError }             from 'node:assert'

import { DomainError }                from '@monstrs/core-errors'
import { GuardErrors }                from '@monstrs/guard-clause'
import { Catch }                      from '@nestjs/common'
import { BaseRpcExceptionFilter }     from '@nestjs/microservices'

import { ValidationError }            from '@monstrs/nestjs-validation'

import { assertionExceptionFactory }  from '../exception-factories/index.js'
import { validationExceptionFactory } from '../exception-factories/index.js'
import { guardExceptionFactory }      from '../exception-factories/index.js'
import { domainExceptionFactory }     from '../exception-factories/index.js'

@Catch()
export class ConnectRpcExceptionsFilter extends BaseRpcExceptionFilter {
  override catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof AssertionError) {
      return super.catch(assertionExceptionFactory(exception), host)
    }

    if (exception instanceof DomainError) {
      return super.catch(domainExceptionFactory(exception), host)
    }

    if (exception instanceof GuardErrors) {
      return super.catch(guardExceptionFactory(exception), host)
    }

    if (exception instanceof ValidationError) {
      return super.catch(validationExceptionFactory(exception.errors), host)
    }

    return super.catch(exception, host)
  }
}
