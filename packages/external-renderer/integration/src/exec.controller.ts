import { Controller, Get, Render } from '@nestjs/common'

@Controller('exec')
export class ExecController {
  @Get('/simple')
  @Render('/render/simple')
  simple() {
    return {}
  }
}
