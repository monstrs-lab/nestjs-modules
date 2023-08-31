import { Injectable }                 from '@nestjs/common'
import { Storage }                    from '@google-cloud/storage'

import { GoogleStorageConfigFactory } from './google-storage.config-factory.js'

@Injectable()
export class GoogleStorageFactory {
  constructor(private readonly configFactory: GoogleStorageConfigFactory) {}

  create(): Storage {
    return new Storage(this.configFactory.createGoogleStorageOptions())
  }
}
