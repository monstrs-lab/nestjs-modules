import { ModuleMetadata } from '@nestjs/common/interfaces'
import { Type }           from '@nestjs/common/interfaces'
import { MeterProvider }  from '@opentelemetry/metrics'

export interface MetricsModuleOptions {
  provider?: MeterProvider
}

export interface MetricsOptionsFactory {
  createMetricsOptions(): Promise<MetricsModuleOptions> | MetricsModuleOptions
}

export interface MetricsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<MetricsOptionsFactory>
  useClass?: Type<MetricsOptionsFactory>
  useFactory?: (...args: any[]) => Promise<MetricsModuleOptions> | MetricsModuleOptions
  inject?: any[]
}
