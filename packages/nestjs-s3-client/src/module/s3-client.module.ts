import type { DynamicModule }         from '@nestjs/common'

import type { S3ClientModuleOptions } from './s3-client.module.interfaces.js'

import { Module }                     from '@nestjs/common'

import { S3_CLIENT_ENDPOINT }         from './s3-client.module.constants.js'
import { S3_CLIENT_REGION }           from './s3-client.module.constants.js'
import { S3_CLIENT_CREDENTIALS }      from './s3-client.module.constants.js'
import { S3ClientConfigFactory }      from './s3-client.config-factory.js'
import { S3ClientFactory }            from './s3-client.factory.js'

@Module({})
export class S3ClientModule {
  static register(options: S3ClientModuleOptions = {}): DynamicModule {
    return {
      module: S3ClientModule,
      providers: [
        S3ClientConfigFactory,
        S3ClientFactory,
        {
          provide: S3_CLIENT_ENDPOINT,
          useValue: options.endpoint,
        },
        {
          provide: S3_CLIENT_REGION,
          useValue: options.region,
        },
        {
          provide: S3_CLIENT_CREDENTIALS,
          useValue: options.credentials,
        },
      ],
      exports: [S3ClientConfigFactory, S3ClientFactory],
    }
  }
}
