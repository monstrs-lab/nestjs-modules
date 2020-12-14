import { Inject, Injectable }       from '@nestjs/common'

import { MetricsOptionsFactory }    from '@monstrs/nestjs-metrics'
import { MetricsModuleOptions }     from '@monstrs/nestjs-metrics'
import { TracingOptionsFactory }    from '@monstrs/nestjs-tracing'
import { TracingModuleOptions }     from '@monstrs/nestjs-tracing'

import { TelemetryModuleOptions }   from './telemetry-module-options.interface'
import { TELEMETRY_MODULE_OPTIONS } from './telemetry.constants'

@Injectable()
export class ChildrenModulesConfig implements MetricsOptionsFactory, TracingOptionsFactory {
  constructor(@Inject(TELEMETRY_MODULE_OPTIONS) private readonly options: TelemetryModuleOptions) {}

  createTracingOptions(): TracingModuleOptions {
    return this.options.tracing || {}
  }

  createMetricsOptions(): MetricsModuleOptions {
    return this.options.metrics || {}
  }
}
