import { Controller, Post } from '@nestjs/common'

@Controller('render')
export class RenderController {
  @Post('simple')
  simple() {
    return 'content'
  }
}
