import { Provider }               from '@nestjs/common'

import { GatewayModuleOptions }   from './gateway-module-options.interface'
import { GATEWAY_MODULE_OPTIONS } from './gateway.constants'
import { GraphQLMeshConfig }      from '../mesh'
import { GraphQLMeshHandler }     from '../mesh'

export const createGatewayOptionsProvider = (options: GatewayModuleOptions): Provider[] => [
  {
    provide: GATEWAY_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createGatewayProvider = (): Provider[] => [GraphQLMeshConfig, GraphQLMeshHandler]

export const createGatewayExportsProvider = (): Provider[] => []