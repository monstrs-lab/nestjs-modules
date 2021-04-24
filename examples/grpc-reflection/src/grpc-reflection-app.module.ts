import { Module }               from '@nestjs/common'

import { GrpcReflectionModule } from '@monstrs/nestjs-grpc-reflection'

import { serverOptions }        from './server.options'
import { EchoModule }           from './echo'

@Module({
  imports: [GrpcReflectionModule.register(serverOptions.options), EchoModule],
})
export class GrpcReflectionAppModule {}
