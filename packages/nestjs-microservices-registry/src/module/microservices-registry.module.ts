import type { DynamicModule }    from '@nestjs/common'

import { Module }                from '@nestjs/common'
import hash                      from 'hash-string'

import { MicroservisesRegistry } from '../registry/index.js'

@Module({})
export class MicroservisesRegistryModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: MicroservisesRegistryModule,
      providers: [
        {
          provide: MicroservisesRegistry,
          useValue: MicroservisesRegistry,
        },
      ],
      exports: [
        {
          provide: MicroservisesRegistry,
          useValue: MicroservisesRegistry,
        },
      ],
    }
  }

  static connect(options: any) {
    return {
      module: MicroservisesRegistryModule,
      providers: [
        {
          provide: hash(JSON.stringify(options)),
          useFactory: (registry) => {
            registry.add(options)
          },
          inject: [MicroservisesRegistry],
        },
      ],
    }
  }
}