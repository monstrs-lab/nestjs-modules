import type { DynamicModule }            from '@nestjs/common'
import type { RedisOptions }             from 'ioredis'

import { Module }                        from '@nestjs/common'
import { Redis }                         from 'ioredis'

import { REDIS_MODULE_OPTIONS_HOST }     from './redis.module.constants.js'
import { REDIS_MODULE_OPTIONS_PORT }     from './redis.module.constants.js'
import { REDIS_MODULE_OPTIONS_PASSWORD } from './redis.module.constants.js'
import { REDIS_MODULE_OPTIONS_USERNAME } from './redis.module.constants.js'
import { RedisConfigFactory }            from './redis.config-factory.js'

@Module({})
export class BullConfigModule {
  static register(options: RedisOptions = {}): DynamicModule {
    const provider = {
      provide: Redis,
      inject: [RedisConfigFactory],
      useFactory: (configFactory) => new Redis(configFactory.createRedisOptions()),
    }

    return {
      module: BullConfigModule,
      providers: [
        provider,
        RedisConfigFactory,
        {
          provide: REDIS_MODULE_OPTIONS_HOST,
          useValue: options.host,
        },
        {
          provide: REDIS_MODULE_OPTIONS_PORT,
          useValue: options.port,
        },
        {
          provide: REDIS_MODULE_OPTIONS_USERNAME,
          useValue: options.username,
        },
        {
          provide: REDIS_MODULE_OPTIONS_PASSWORD,
          useValue: options.password,
        },
      ],
      exports: [provider, RedisConfigFactory],
    }
  }
}
