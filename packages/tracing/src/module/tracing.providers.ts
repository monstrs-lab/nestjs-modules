import { Provider }               from '@nestjs/common'
import { APP_INTERCEPTOR }        from '@nestjs/core'
import { trace }                  from '@opentelemetry/api'
import { NodeTracerProvider }     from '@opentelemetry/node'
import { Tracer }                 from '@opentelemetry/tracing'

import { TracingModuleOptions }   from './tracing-module-options.interface'
import { TRACING_MODULE_OPTIONS } from './tracing.constants'
import { TRACING_TRACER_NAME }    from './tracing.constants'
import { TRACING_TRACER_VERSION } from './tracing.constants'
import { TracingInterceptor }     from '../interceptors'

export const createTracingOptionsProvider = (options: TracingModuleOptions): Provider[] => [
  {
    provide: TRACING_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createTracingProvider = (): Provider[] => [
  {
    provide: APP_INTERCEPTOR,
    useClass: TracingInterceptor,
  },
]

export const createTracingExportsProvider = (): Provider[] => [
  {
    provide: NodeTracerProvider,
    useFactory: (options: TracingModuleOptions) => {
      if (options.provider) {
        return options.provider
      }

      return trace.getTracerProvider()
    },
    inject: [TRACING_MODULE_OPTIONS],
  },
  {
    provide: Tracer,
    useFactory: (provider: NodeTracerProvider): Tracer =>
      provider.getTracer(TRACING_TRACER_NAME, TRACING_TRACER_VERSION),
    inject: [NodeTracerProvider],
  },
]
