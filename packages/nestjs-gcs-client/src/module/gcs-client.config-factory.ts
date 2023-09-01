import type { StorageOptions }         from '@google-cloud/storage'

import type { GcsClientModuleOptions } from './gcs-client.module.interfaces.js'

import { Injectable }                  from '@nestjs/common'
import { Inject }                      from '@nestjs/common'

import { GCS_CLIENT_API_ENDPOINT }     from './gcs-client.module.constants.js'
import { GCS_CLIENT_KEY_FILENAME }     from './gcs-client.module.constants.js'

@Injectable()
export class GcsClientConfigFactory {
  constructor(
    @Inject(GCS_CLIENT_API_ENDPOINT)
    private readonly apiEndpoint?: string,
    @Inject(GCS_CLIENT_KEY_FILENAME)
    private readonly keyFilename?: string
  ) {}

  createGcsClientOptions(options: GcsClientModuleOptions = {}): StorageOptions {
    return {
      apiEndpoint: options.apiEndpoint || this.apiEndpoint || process.env.GCS_API_ENDPOINT,
      keyFilename: options.keyFilename || this.keyFilename || process.env.GCS_KEY_FILENAME,
    }
  }
}
