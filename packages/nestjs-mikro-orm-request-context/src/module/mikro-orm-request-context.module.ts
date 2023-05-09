import { DynamicModule }                     from '@nestjs/common'
import { Module }                            from '@nestjs/common'
import { APP_INTERCEPTOR }                   from '@nestjs/core'
import { MikroORM }                          from '@mikro-orm/core'

import { MikroORMRequestContextInterceptor } from '../interceptors/index.js'

@Module({})
export class MikroORMRequestContextModule {
  static forInterceptor(options = {}): DynamicModule {
    return {
      ...options,
      module: MikroORMRequestContextModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useFactory: (orm) => new MikroORMRequestContextInterceptor(orm),
          inject: [MikroORM],
        },
      ],
    }
  }
}
