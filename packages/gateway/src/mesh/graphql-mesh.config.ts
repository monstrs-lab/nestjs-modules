/* eslint-disable no-else-return */

import { Inject }                 from '@nestjs/common'
import { Injectable }             from '@nestjs/common'
import InMemoryLRUCache           from '@graphql-mesh/cache-inmemory-lru'
import StitchingMerger            from '@graphql-mesh/merger-stitching'
import { PubSub }                 from 'graphql-subscriptions'
import { EventEmitter }           from 'events'
import { MeshPubSub }             from '@graphql-mesh/types'
import { GetMeshOptions }         from '@graphql-mesh/runtime'
import GrpcHandler                from '@graphql-mesh/grpc'

import { GATEWAY_MODULE_OPTIONS } from '../module'
import { GatewayModuleOptions }   from '../module'
import { SourceOptions }          from '../module'
import { GatewaySourceType }      from '../enums'

@Injectable()
export class GraphQLMeshConfig {
  private cache

  private merger

  private pubsub

  constructor(
    @Inject(GATEWAY_MODULE_OPTIONS)
    private readonly options: GatewayModuleOptions
  ) {
    this.cache = options.cache || new InMemoryLRUCache()
    this.merger = options.merger || StitchingMerger

    if (options.pubsub) {
      this.pubsub = options.pubsub
    } else {
      const eventEmitter = new EventEmitter({ captureRejections: true })

      eventEmitter.setMaxListeners(Infinity)

      this.pubsub = new PubSub({ eventEmitter }) as MeshPubSub
    }
  }

  create(): GetMeshOptions {
    return {
      sources: this.createSources(),
      cache: this.cache,
      pubsub: this.pubsub,
      merger: this.merger,
      transforms: [],
      additionalTypeDefs: undefined,
      additionalResolvers: {},
    }
  }

  protected createSources() {
    return (this.options.sources || []).map((source) => ({
      name: source.name,
      handler: this.createHandler(source),
      transforms: [],
    }))
  }

  protected createHandler(source: SourceOptions) {
    if (source.type === GatewaySourceType.GRPC) {
      return new GrpcHandler({
        name: source.name,
        config: source.handler,
        cache: this.cache,
        pubsub: this.pubsub,
      })
    } else {
      throw new Error(`Unknown source type: ${source.type}`)
    }
  }
}
