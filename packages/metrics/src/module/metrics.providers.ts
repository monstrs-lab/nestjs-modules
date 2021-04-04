import { Provider }               from '@nestjs/common'
import { MeterProvider }          from '@opentelemetry/metrics'
import { Meter }                  from '@opentelemetry/metrics'
import { metrics }                from '@opentelemetry/api'

import { MetricsModuleOptions }   from './metrics-module-options.interface'
import { METRICS_MODULE_OPTIONS } from './metrics.constants'
import { METER_NAME }             from './metrics.constants'

export const createMetricsOptionsProvider = (options: MetricsModuleOptions): Provider[] => [
  {
    provide: METRICS_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createMetricsProvider = (): Provider[] => []

export const createMetricsExportsProvider = (): Provider[] => [
  {
    provide: MeterProvider,
    useFactory: (options: MetricsModuleOptions) => {
      if (options.provider) {
        return options.provider
      }

      return metrics.getMeterProvider()
    },
    inject: [METRICS_MODULE_OPTIONS],
  },
  {
    provide: Meter,
    useFactory: (meterProvider: MeterProvider): Meter => meterProvider.getMeter(METER_NAME),
    inject: [MeterProvider],
  },
]
