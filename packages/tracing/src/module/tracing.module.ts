import { DynamicModule }                from '@nestjs/common'
import { Module }                       from '@nestjs/common'
import { Provider }                     from '@nestjs/common'

import { TracingModuleAsyncOptions }    from './tracing-module-options.interface'
import { TracingModuleOptions }         from './tracing-module-options.interface'
import { TracingOptionsFactory }        from './tracing-module-options.interface'
import { TRACING_MODULE_OPTIONS }       from './tracing.constants'
import { createTracingExportsProvider } from './tracing.providers'
import { createTracingProvider }        from './tracing.providers'
import { createTracingOptionsProvider } from './tracing.providers'

@Module({})
export class TracingModule {
  static register(options: TracingModuleOptions = {}): DynamicModule {
    const optionsProviders = createTracingOptionsProvider(options)
    const exportsProviders = createTracingExportsProvider()
    const providers = createTracingProvider()

    return {
      module: TracingModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: TracingModuleAsyncOptions = {}): DynamicModule {
    const exportsProviders = createTracingExportsProvider()
    const providers = createTracingProvider()

    return {
      module: TracingModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: TracingModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: TracingModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: TRACING_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: TRACING_MODULE_OPTIONS,
      useFactory: (optionsFactory: TracingOptionsFactory) => optionsFactory.createTracingOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
