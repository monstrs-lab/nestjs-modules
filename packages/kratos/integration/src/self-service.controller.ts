import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller()
export class SelfServiceController {
  @Get('/self-service/login/flows')
  @HttpCode(403)
  login() {}

  @Get('/self-service/registration/flows')
  @HttpCode(404)
  registration() {}

  @Get('/self-service/recovery/flows')
  @HttpCode(410)
  recovery() {}
}
