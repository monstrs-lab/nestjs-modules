import { DynamicModule, Module, Provider } from '@nestjs/common'

import { MetricsModule }                   from '@monstrs/nestjs-metrics'
import { TracingModule }                   from '@monstrs/nestjs-tracing'

import { ChildrenModulesConfig }           from './children-modules.config'
import { TelemetryModuleAsyncOptions }     from './telemetry-module-options.interface'
import { TelemetryModuleOptions }          from './telemetry-module-options.interface'
import { TelemetryOptionsFactory }         from './telemetry-module-options.interface'
import { TELEMETRY_MODULE_OPTIONS }        from './telemetry.constants'

@Module({})
export class TelemetryModule {
  static register(options: TelemetryModuleOptions = {}): DynamicModule {
    return {
      module: TelemetryModule,
      providers: [
        {
          provide: TELEMETRY_MODULE_OPTIONS,
          useValue: options,
        },
        ChildrenModulesConfig,
      ],
      exports: [ChildrenModulesConfig],
      imports: [MetricsModule.register(options.metrics), TracingModule.register(options.tracing)],
    }
  }

  static registerAsync(options: TelemetryModuleAsyncOptions = {}): DynamicModule {
    return {
      module: TelemetryModule,
      imports: [
        ...(options.imports || []),
        MetricsModule.registerAsync({
          useExisting: ChildrenModulesConfig,
        }),
        TracingModule.registerAsync({
          useExisting: ChildrenModulesConfig,
        }),
      ],
      providers: [...this.createAsyncProviders(options), ChildrenModulesConfig],
      exports: [ChildrenModulesConfig],
    }
  }

  private static createAsyncProviders(options: TelemetryModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: TelemetryModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: TELEMETRY_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: TELEMETRY_MODULE_OPTIONS,
      useFactory: (optionsFactory: TelemetryOptionsFactory) =>
        optionsFactory.createTelemetryOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
