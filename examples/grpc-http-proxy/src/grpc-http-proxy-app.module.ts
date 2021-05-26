import { Module }               from '@nestjs/common'

import { GrpcReflectionModule } from '@monstrs/nestjs-grpc-reflection'
import { GrpcHttpProxyModule }  from '@monstrs/nestjs-grpc-http-proxy'

import { serverOptions }        from './server.options'
import { EchoModule }           from './echo'

@Module({
  imports: [
    GrpcReflectionModule.register(serverOptions.options),
    GrpcHttpProxyModule.register({ options: serverOptions.options }),
    EchoModule,
  ],
})
export class GrpcHttpProxyAppModule {}
