import { DynamicModule, Module }       from '@nestjs/common'

import { GrpcHttpProxyModule }         from '@monstrs/nestjs-grpc-http-proxy'
import { GrpcReflectionModule }        from '@monstrs/nestjs-grpc-reflection'

import { GrpcPlaygroundModuleOptions } from './grpc-playground-module-options.interface'
import { GrpcPlaygroundController }    from '../controllers'

@Module({})
export class GrpcPlaygroundModule {
  static register(options: GrpcPlaygroundModuleOptions): DynamicModule {
    return {
      module: GrpcPlaygroundModule,
      imports: [
        GrpcReflectionModule.register(options.options),
        GrpcHttpProxyModule.register(options.options),
      ],
      controllers: [GrpcPlaygroundController],
    }
  }
}
