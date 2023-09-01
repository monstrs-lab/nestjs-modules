import type { DynamicModule }          from '@nestjs/common'

import type { GcsClientModuleOptions } from './gcs-client.module.interfaces.js'

import { Module }                      from '@nestjs/common'

import { GcsClientConfigFactory }      from './gcs-client.config-factory.js'
import { GcsClientFactory }            from './gcs-client.factory.js'
import { GCS_CLIENT_API_ENDPOINT }     from './gcs-client.module.constants.js'
import { GCS_CLIENT_KEY_FILENAME }     from './gcs-client.module.constants.js'

@Module({})
export class GcsClientModule {
  static register(options: GcsClientModuleOptions = {}): DynamicModule {
    return {
      module: GcsClientModule,
      providers: [
        GcsClientConfigFactory,
        GcsClientFactory,
        {
          provide: GCS_CLIENT_API_ENDPOINT,
          useValue: options.apiEndpoint,
        },
        {
          provide: GCS_CLIENT_KEY_FILENAME,
          useValue: options.keyFilename,
        },
      ],
      exports: [GcsClientConfigFactory, GcsClientFactory],
    }
  }
}
