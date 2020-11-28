import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { GrpcOptions }          from '@nestjs/microservices'

export type GrpcHttpProxyModuleOptions = GrpcOptions['options']

export interface GrpcHttpProxyOptionsFactory {
  createGrpcHttpProxyOptions(): Promise<GrpcHttpProxyModuleOptions> | GrpcHttpProxyModuleOptions
}

export interface GrpcHttpProxyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<GrpcHttpProxyOptionsFactory>
  useClass?: Type<GrpcHttpProxyOptionsFactory>
  useFactory?: (...args: any[]) => Promise<GrpcHttpProxyModuleOptions> | GrpcHttpProxyModuleOptions
  inject?: any[]
}
