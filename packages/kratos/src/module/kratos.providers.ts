import { Provider }              from '@nestjs/common'
import { APP_FILTER }            from '@nestjs/core'
import { Configuration }         from '@ory/kratos-client'
import { PublicApi }             from '@ory/kratos-client'
import { AdminApi }              from '@ory/kratos-client'

import { KratosExceptionFilter } from '../filters'
import { WhoamiPipe }            from '../pipes'
import { KratosBrowserUrls }     from '../urls'
import { KratosModuleOptions }   from './kratos-module-options.interface'
import { KRATOS_MODULE_OPTIONS } from './kratos.constants'

export const createKratosOptionsProvider = (options: KratosModuleOptions): Provider[] => {
  return [
    {
      provide: KRATOS_MODULE_OPTIONS,
      useValue: options,
    },
  ]
}

export const createKratosProvider = (): Provider[] => {
  return [
    {
      provide: APP_FILTER,
      useClass: KratosExceptionFilter,
    },
  ]
}

export const createKratosExportsProvider = (): Provider[] => {
  return [
    {
      provide: PublicApi,
      useFactory: (config: KratosModuleOptions) =>
        new PublicApi(new Configuration({ basePath: config.public })),
      inject: [KRATOS_MODULE_OPTIONS],
    },
    {
      provide: AdminApi,
      useFactory: (config: KratosModuleOptions) =>
        new AdminApi(new Configuration({ basePath: config.admin || 'http://kratos-admin:4434' })),
      inject: [KRATOS_MODULE_OPTIONS],
    },
    KratosBrowserUrls,
    WhoamiPipe,
  ]
}
