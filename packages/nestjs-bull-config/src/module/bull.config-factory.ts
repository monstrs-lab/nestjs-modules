import type { BullOptionsFactory }               from '@nestjs/bull'
import type { BullModuleOptions }                from '@nestjs/bull'

import { Inject }                                from '@nestjs/common'
import { Injectable }                            from '@nestjs/common'

import { BullConfigOptions }                     from './bull-config.module.interfaces.js'
import { BULL_CONFIG_MODULE_OPTIONS }            from './bull-config.module.constants.js'
import { BULL_CONFIG_MODULE_OPTIONS_REDIS_PORT } from './bull-config.module.constants.js'
import { BULL_CONFIG_MODULE_OPTIONS_REDIS_HOST } from './bull-config.module.constants.js'

@Injectable()
export class BullConfigFactory implements BullOptionsFactory {
  constructor(
    @Inject(BULL_CONFIG_MODULE_OPTIONS)
    private readonly options: BullConfigOptions,
    @Inject(BULL_CONFIG_MODULE_OPTIONS_REDIS_PORT)
    private readonly port: number,
    @Inject(BULL_CONFIG_MODULE_OPTIONS_REDIS_HOST)
    private readonly host: string
  ) {}

  createBullOptions(): BullModuleOptions {
    return {
      ...this.options,
      redis: {
        host: this.host || process.env.REDIS_HOST || 'localhost',
        port: this.port || 6379,
      },
    }
  }
}
