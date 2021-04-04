import { DynamicModule, Module, Provider } from '@nestjs/common'
import { DiscoveryModule }                 from '@nestjs/core'

import { GitHubAppModuleAsyncOptions }     from './github-app-module-options.interface'
import { GitHubAppModuleOptions }          from './github-app-module-options.interface'
import { GitHubAppOptionsFactory }         from './github-app-module-options.interface'
import { GITHUB_APP_MODULE_OPTIONS }       from './github-app.constants'
import { createGitHubAppExportsProvider }  from './github-app.providers'
import { createGitHubAppProvider }         from './github-app.providers'
import { createGitHubAppOptionsProvider }  from './github-app.providers'

@Module({
  imports: [DiscoveryModule],
})
export class GitHubAppModule {
  static register(options: GitHubAppModuleOptions): DynamicModule {
    const optionsProviders = createGitHubAppOptionsProvider(options)
    const exportsProviders = createGitHubAppExportsProvider()
    const providers = createGitHubAppProvider()

    return {
      module: GitHubAppModule,
      providers: [...optionsProviders, ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  static registerAsync(options: GitHubAppModuleAsyncOptions): DynamicModule {
    const exportsProviders = createGitHubAppExportsProvider()
    const providers = createGitHubAppProvider()

    return {
      module: GitHubAppModule,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options), ...providers, ...exportsProviders],
      exports: exportsProviders,
    }
  }

  private static createAsyncProviders(options: GitHubAppModuleAsyncOptions): Provider[] {
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

  private static createAsyncOptionsProvider(options: GitHubAppModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: GITHUB_APP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: GITHUB_APP_MODULE_OPTIONS,
      useFactory: (optionsFactory: GitHubAppOptionsFactory) =>
        optionsFactory.createGitHubAppOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}
