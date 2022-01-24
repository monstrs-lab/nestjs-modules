import { Module }               from '@nestjs/common'

import { GrpcHttpProxyModule }  from '@monstrs/nestjs-grpc-http-proxy'
import { GrpcReflectionModule } from '@monstrs/nestjs-grpc-reflection'

import { EchoModule }           from './echo'
import { serverOptions }        from './server.options'

@Module({
  imports: [
    GrpcReflectionModule.register(serverOptions.options),
    GrpcHttpProxyModule.register({ options: serverOptions.options }),
    EchoModule,
  ],
})
export class GrpcHttpProxyAppModule {}
