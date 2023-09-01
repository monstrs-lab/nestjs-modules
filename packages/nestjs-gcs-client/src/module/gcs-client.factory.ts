import type { GcsClientModuleOptions } from './gcs-client.module.interfaces.js'

import { Injectable }                  from '@nestjs/common'
import { Storage }                     from '@google-cloud/storage'

import { GcsClientConfigFactory }      from './gcs-client.config-factory.js'

@Injectable()
export class GcsClientFactory {
  constructor(private readonly configFactory: GcsClientConfigFactory) {}

  create(options: GcsClientModuleOptions = {}): Storage {
    return new Storage(this.configFactory.createGcsClientOptions(options))
  }
}
