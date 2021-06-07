/* eslint-disable no-else-return */

import { Inject }                    from '@nestjs/common'
import { Injectable }                from '@nestjs/common'
import InMemoryLRUCache              from '@graphql-mesh/cache-inmemory-lru'
import StitchingMerger               from '@graphql-mesh/merger-stitching'
import RenameTransform               from '@graphql-mesh/transform-rename'
import EncapsulateTransform          from '@graphql-mesh/transform-encapsulate'
import PrefixTransform               from '@graphql-mesh/transform-prefix'
import CacheTransform                from '@graphql-mesh/transform-cache'
import SnapshotTransform             from '@graphql-mesh/transform-snapshot'
import MockingTransform              from '@graphql-mesh/transform-mock'
import ResolversCompositionTransform from '@graphql-mesh/transform-resolvers-composition'
import NamingConventionTransform     from '@graphql-mesh/transform-naming-convention'
import FilterTransform               from '@graphql-mesh/transform-filter-schema'
import { PubSub }                    from 'graphql-subscriptions'
import { EventEmitter }              from 'events'
import { MeshPubSub }                from '@graphql-mesh/types'
import { GetMeshOptions }            from '@graphql-mesh/runtime'
import GrpcHandler                   from '@graphql-mesh/grpc'
import { MeshTransform }             from '@graphql-mesh/types'

import { GATEWAY_MODULE_OPTIONS }    from '../module'
import { GatewayModuleOptions }      from '../module'
import { SourceOptions }             from '../module'
import { SourceTransformsOptions }   from '../module'
import { GatewaySourceType }         from '../enums'

@Injectable()
export class GraphQLMeshConfig {
  private cache

  private merger

  private pubsub

  private transforms: MeshTransform[]

  constructor(
    @Inject(GATEWAY_MODULE_OPTIONS)
    private readonly options: GatewayModuleOptions
  ) {
    this.cache = options.cache || new InMemoryLRUCache()
    this.merger = options.merger || StitchingMerger
    this.transforms = this.createTransforms(options.transforms)

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
      transforms: this.transforms,
      additionalTypeDefs: undefined,
      additionalResolvers: {},
    }
  }

  protected createSources() {
    return (this.options.sources || []).map((source) => ({
      name: source.name,
      handler: this.createHandler(source),
      transforms: this.createTransforms(source.transforms),
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

  protected createTransforms(config: SourceTransformsOptions = {}) {
    const transforms: any[] = []

    if (config.rename) {
      transforms.push(
        RenameTransform({ config: config.rename, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.filterSchema) {
      transforms.push(
        FilterTransform({ config: config.filterSchema, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.encapsulate) {
      transforms.push(
        new EncapsulateTransform({
          config: config.encapsulate,
          cache: this.cache,
          pubsub: this.pubsub,
        })
      )
    }

    if (config.prefix) {
      transforms.push(
        new PrefixTransform({ config: config.prefix, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.cache) {
      transforms.push(
        new CacheTransform({ config: config.cache, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.snapshot) {
      transforms.push(
        new SnapshotTransform({ config: config.snapshot, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.mock) {
      transforms.push(
        new MockingTransform({ config: config.mock, cache: this.cache, pubsub: this.pubsub })
      )
    }

    if (config.resolversComposition) {
      transforms.push(
        new ResolversCompositionTransform({
          config: config.resolversComposition,
          cache: this.cache,
          pubsub: this.pubsub,
        })
      )
    }

    if (config.namingConvention) {
      transforms.push(
        new NamingConventionTransform({
          config: config.namingConvention,
          cache: this.cache,
          pubsub: this.pubsub,
        })
      )
    }

    return transforms
  }
}
