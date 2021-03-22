import { Provider }                from '@nestjs/common'
import { Configuration, AdminApi } from '@oryd/hydra-client'

import { HydraModuleOptions }      from './hydra-module-options.interface'
import { HYDRA_MODULE_OPTIONS }    from './hydra.constants'

export const createHydraOptionsProvider = (options: HydraModuleOptions): Provider[] => {
  return [
    {
      provide: HYDRA_MODULE_OPTIONS,
      useValue: options,
    },
  ]
}

export const createHydraProvider = (): Provider[] => {
  return []
}

export const createHydraExportsProvider = (): Provider[] => {
  return [
    {
      provide: AdminApi,
      useFactory: (config: HydraModuleOptions) => {
        const baseOptions = config.tls?.termination
          ? { headers: { 'X-Forwarded-Proto': 'https' } }
          : {}

        return new AdminApi(new Configuration({ basePath: config.urls.admin, baseOptions }))
      },
      inject: [HYDRA_MODULE_OPTIONS],
    },
  ]
}
