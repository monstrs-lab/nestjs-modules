import type { DynamicModule }                          from '@nestjs/common'

import type { GraphQLRedisSubscriptionsModuleOptions } from './graphql-redis-subscriptions.module.interfaces.js'

import { Module }                                      from '@nestjs/common'
import { RedisPubSub }                                 from 'graphql-redis-subscriptions'
import { PubSub }                                      from 'graphql-subscriptions'

import { RedisModule }                                 from '@monstrs/nestjs-redis'
import { RedisFactory }                                from '@monstrs/nestjs-redis'

@Module({})
export class GraphQLRedisSubscriptionsModule {
  static register(options: GraphQLRedisSubscriptionsModuleOptions = {}): DynamicModule {
    const provider = {
      provide: PubSub,
      useFactory: (redisFactory: RedisFactory) =>
        new RedisPubSub({
          ...options,
          publisher: redisFactory.create(),
          subscriber: redisFactory.create(),
        }),
      inject: [RedisFactory],
    }

    return {
      global: true,
      module: GraphQLRedisSubscriptionsModule,
      imports: [RedisModule.register()],
      providers: [provider],
      exports: [provider],
    }
  }
}
