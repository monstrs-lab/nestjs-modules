import { ModuleMetadata, Type } from '@nestjs/common/interfaces'

export interface KratosModuleOptions {
  browser: string
  public: string
}

export interface KratosOptionsFactory {
  createKratosOptions(): Promise<KratosModuleOptions> | KratosModuleOptions
}

export interface KratosModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<KratosOptionsFactory>
  useClass?: Type<KratosOptionsFactory>
  useFactory?: (...args: any[]) => Promise<KratosModuleOptions> | KratosModuleOptions
  inject?: any[]
}
