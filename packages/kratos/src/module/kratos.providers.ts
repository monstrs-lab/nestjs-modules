import { Provider }                 from '@nestjs/common'
import { APP_FILTER }               from '@nestjs/core'
import { Configuration, PublicApi } from '@oryd/kratos-client'

import { KratosExceptionFilter }    from '../filters'
import { KratosModuleOptions }      from './kratos-module-options.interface'
import { KRATOS_MODULE_OPTIONS }    from './kratos.constants'

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
  ]
}
