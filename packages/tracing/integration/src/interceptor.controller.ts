import { Controller, Get } from '@nestjs/common'

@Controller('interceptor')
export class InterceptorController {
  @Get('/intercept')
  intercept() {
    return {
      success: true,
    }
  }
}
