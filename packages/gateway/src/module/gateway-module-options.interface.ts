import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { MeshPubSub }           from '@graphql-mesh/types'
import { KeyValueCache }        from '@graphql-mesh/types'
import { MergerFn }             from '@graphql-mesh/types'
import { YamlConfig }           from '@graphql-mesh/types'

import { GatewaySourceType }    from '../enums'

export interface SourceOptions {
  name: string
  type: GatewaySourceType
  handler: YamlConfig.GrpcHandler
}

export interface GatewayModuleOptions {
  path?: string
  pubsub?: MeshPubSub
  cache?: KeyValueCache
  merger?: MergerFn
  sources?: SourceOptions[]
}

export interface GatewayOptionsFactory {
  createGatewayOptions(): Promise<GatewayModuleOptions> | GatewayModuleOptions
}

export interface GatewayModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<GatewayOptionsFactory>
  useClass?: Type<GatewayOptionsFactory>
  useFactory?: (...args: any[]) => Promise<GatewayModuleOptions> | GatewayModuleOptions
  inject?: any[]
}