import { Module }              from '@nestjs/common'

import { GrpcHttpProxyModule } from '../../src'
import { serverOptions }       from './proto.options'
import { TestController }      from './test.controller'

@Module({
  imports: [GrpcHttpProxyModule.register(serverOptions.options)],
  controllers: [TestController],
})
export class GrpcHttpProxyIntegrationModule {}
