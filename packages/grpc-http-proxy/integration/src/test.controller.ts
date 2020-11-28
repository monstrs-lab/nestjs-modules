import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

@Controller()
export class TestController {
  @GrpcMethod('TestService', 'test')
  test({ id }) {
    return {
      id,
    }
  }
}
