import { Provider }                       from '@nestjs/common'

import { GrpcHttpProxyModuleOptions }     from './grpc-http-proxy-module-options.interface'
import { GRPC_HTTP_PROXY_MODULE_OPTIONS } from './grpc-http-proxy.constants'
import { ProtoRegistry }                  from '../proto'

export const createGrpcHttpProxyOptionsProvider = (
  options: GrpcHttpProxyModuleOptions
): Provider[] => {
  return [
    {
      provide: GRPC_HTTP_PROXY_MODULE_OPTIONS,
      useValue: options,
    },
  ]
}

export const createGrpcHttpProxyProvider = (): Provider[] => {
  return [ProtoRegistry]
}

export const createGrpcHttpProxyExportsProvider = (): Provider[] => {
  return []
}