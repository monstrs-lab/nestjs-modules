import { ModuleMetadata }     from '@nestjs/common/interfaces'
import { Type }               from '@nestjs/common/interfaces'
import { NodeTracerProvider } from '@opentelemetry/node'

export interface TracingModuleOptions {
  provider?: NodeTracerProvider
}

export interface TracingOptionsFactory {
  createTracingOptions(): Promise<TracingModuleOptions> | TracingModuleOptions
}

export interface TracingModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TracingOptionsFactory>
  useClass?: Type<TracingOptionsFactory>
  useFactory?: (...args: any[]) => Promise<TracingModuleOptions> | TracingModuleOptions
  inject?: any[]
}
