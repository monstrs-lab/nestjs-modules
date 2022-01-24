import { ModuleMetadata }       from '@nestjs/common/interfaces'
import { Type }                 from '@nestjs/common/interfaces'

import { MetricsModuleOptions } from '@monstrs/nestjs-metrics'
import { TracingModuleOptions } from '@monstrs/nestjs-tracing'

export interface TelemetryModuleOptions {
  metrics?: MetricsModuleOptions
  tracing?: TracingModuleOptions
}

export interface TelemetryOptionsFactory {
  createTelemetryOptions(): Promise<TelemetryModuleOptions> | TelemetryModuleOptions
}

export interface TelemetryModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TelemetryOptionsFactory>
  useClass?: Type<TelemetryOptionsFactory>
  useFactory?: (...args: any[]) => Promise<TelemetryModuleOptions> | TelemetryModuleOptions
  inject?: any[]
}
