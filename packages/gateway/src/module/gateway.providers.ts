import { Provider }                from '@nestjs/common'

import { GatewayModuleOptions }    from './gateway-module-options.interface'
import { GATEWAY_MODULE_OPTIONS }  from './gateway.constants'
import { GraphQLMeshHandler }      from '../mesh'
import { GraphQLMeshConfig }       from '../mesh'
import { GraphQLMesh }             from '../mesh'

import { GraphQLMeshSchemaDumper } from '../mesh'

export const createGatewayOptionsProvider = (options: GatewayModuleOptions): Provider[] => [
  {
    provide: GATEWAY_MODULE_OPTIONS,
    useValue: options,
  },
]

export const createGatewayProvider = (): Provider[] => [
  GraphQLMeshConfig,
  GraphQLMeshHandler,
  GraphQLMesh,
  GraphQLMeshSchemaDumper,
]

export const createGatewayExportsProvider = (): Provider[] => []
