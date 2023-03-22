import { DynamicModule }                  from '@nestjs/common'
import { Module }                         from '@nestjs/common'
import { Transport }                      from '@nestjs/microservices'

import { GrpcReflectionModule }           from 'nestjs-grpc-reflection'

import { GrpcHttpProxyModule }            from '@monstrs/nestjs-grpc-http-proxy'

import { GrpcPlaygroundController }       from '../controllers'
import { GrpcPlaygroundModuleOptions }    from './grpc-playground-module-options.interface'
import { GRPC_PLAYGROUND_MODULE_OPTIONS } from './grpc-playground.constants'

@Module({})
export class GrpcPlaygroundModule {
  static register(options: GrpcPlaygroundModuleOptions): DynamicModule {
    return {
      module: GrpcPlaygroundModule,
      imports: [
        GrpcReflectionModule.register({
          transport: Transport.GRPC,
          options: options.options,
        }),
        GrpcHttpProxyModule.register({
          authenticator: options.authenticator,
          options: options.options,
        }),
      ],
      providers: [
        {
          provide: GRPC_PLAYGROUND_MODULE_OPTIONS,
          useValue: {
            ...options,
            version: options.version || '0.0.10',
          },
        },
      ],
      controllers: [GrpcPlaygroundController],
    }
  }
}
