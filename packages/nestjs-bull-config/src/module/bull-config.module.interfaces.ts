import type { BullModuleOptions } from '@nestjs/bull'
import type { RedisOptions }      from 'ioredis'

export interface BullConfigOptions extends Partial<BullModuleOptions> {
  redis?: RedisOptions
}
