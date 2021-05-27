/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-else-return */

import { CallHandler, ExecutionContext } from '@nestjs/common'
import { Injectable, NestInterceptor }   from '@nestjs/common'
import { Observable, throwError }        from 'rxjs'
import { catchError }                    from 'rxjs/operators'
import { tap }                           from 'rxjs/operators'
import { Tracer }                        from '@opentelemetry/tracing'
import { Attributes }                    from '@opentelemetry/api'

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly tracer: Tracer) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.tracer.getCurrentSpan() === undefined) {
      return next.handle()
    }

    const contextType = context.getType()

    if (contextType === 'ws') {
      return next.handle()
    }

    const methodKey = context.getHandler().name
    const className = context.getClass().name

    const operation = [contextType, className, methodKey].join(':')

    const attributes: Attributes = {
      component: contextType,
      operation,
    }

    const span = this.tracer.startSpan(operation, {
      attributes,
    })

    return next.handle().pipe(
      tap(() => {
        span.end()
      }),
      catchError((error: Error) => {
        span.setAttribute('error', true)

        return throwError(error)
      })
    )
  }
}
