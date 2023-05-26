import type { DynamicModule }                    from '@nestjs/common'

import type { BullConfigOptions }                from './bull-config.module.interfaces.js'

import { Module }                                from '@nestjs/common'

import { BULL_CONFIG_MODULE_OPTIONS }            from './bull-config.module.constants.js'
import { BULL_CONFIG_MODULE_OPTIONS_REDIS_HOST } from './bull-config.module.constants.js'
import { BULL_CONFIG_MODULE_OPTIONS_REDIS_PORT } from './bull-config.module.constants.js'
import { BullConfigFactory }                     from './bull.config-factory.js'

@Module({})
export class BullConfigModule {
  static register(options: BullConfigOptions): DynamicModule {
    return {
      module: BullConfigModule,
      providers: [
        BullConfigFactory,
        {
          provide: BULL_CONFIG_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: BULL_CONFIG_MODULE_OPTIONS_REDIS_HOST,
          useValue: options.redis?.host,
        },
        {
          provide: BULL_CONFIG_MODULE_OPTIONS_REDIS_PORT,
          useValue: options.redis?.host,
        },
      ],
      exports: [BullConfigFactory],
    }
  }
}
