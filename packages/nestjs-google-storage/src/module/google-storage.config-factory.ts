import type { StorageOptions } from '@google-cloud/storage'

import { Injectable }          from '@nestjs/common'

@Injectable()
export class GoogleStorageConfigFactory {
  createGoogleStorageOptions(): StorageOptions {
    return {}
  }
}
