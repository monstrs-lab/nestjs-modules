import { CallHandler }      from '@nestjs/common'
import { ExecutionContext } from '@nestjs/common'
import { Injectable }       from '@nestjs/common'
import { NestInterceptor }  from '@nestjs/common'
import { Attributes }       from '@opentelemetry/api'
import { Tracer }           from '@opentelemetry/tracing'

import { Observable }       from 'rxjs'
import { throwError }       from 'rxjs'
import { catchError }       from 'rxjs/operators'
import { tap }              from 'rxjs/operators'

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
