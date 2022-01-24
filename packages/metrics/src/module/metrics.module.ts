import { DynamicModule }                from '@nestjs/common'
import { Module }                       from '@nestjs/common'
import { Provider }                     from '@nestjs/common'

import { MetricsModuleAsyncOptions }    from './metrics-module-options.interface'
import { MetricsModuleOptions }         from './metrics-module-options.interface'
import { MetricsOptionsFactory }        from './metrics-module-options.interface'
import { METRICS_MODULE_OPTIONS }       from './metrics.constants'
import { createMetricsExportsProvider } from './metrics.providers'
import { createMetricsProvider }        from './metrics.providers'
import { createMetricsOptionsProvider } from './metrics.providers'

@Module({})
export class MetricsModule {
  static register(options: MetricsModuleOptions = {}): DynamicModule {
    const optionsProviders = createMetricsOptionsProvider(options)
    const exportsProviders = createMetricsExportsProvider()
    const providers = createMetricsProvider()

    return {
      module: MetricsModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: MetricsModuleAsyncOptions = {}): DynamicModule {
    const exportsProviders = createMetricsExportsProvider()
    const providers = createMetricsProvider()

    return {
      module: MetricsModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: MetricsModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: MetricsModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: METRICS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: METRICS_MODULE_OPTIONS,
      useFactory: (optionsFactory: MetricsOptionsFactory) => optionsFactory.createMetricsOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
