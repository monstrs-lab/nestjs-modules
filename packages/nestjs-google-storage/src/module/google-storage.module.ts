import type { DynamicModule }         from '@nestjs/common'

import { Module }                     from '@nestjs/common'

import { GoogleStorageConfigFactory } from './google-storage.config-factory.js'
import { GoogleStorageFactory }       from './google-storage.factory.js'

@Module({})
export class GoogleStorageModule {
  static register(): DynamicModule {
    return {
      module: GoogleStorageModule,
      providers: [GoogleStorageConfigFactory, GoogleStorageFactory],
      exports: [GoogleStorageConfigFactory, GoogleStorageFactory],
    }
  }
}
