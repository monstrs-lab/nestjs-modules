import { Module }                from '@nestjs/common'

import { TracingModule }         from '../../src'
import { InterceptorController } from './interceptor.controller'

@Module({
  imports: [TracingModule.register()],
  controllers: [InterceptorController],
})
export class TracingIntegrationModule {}
