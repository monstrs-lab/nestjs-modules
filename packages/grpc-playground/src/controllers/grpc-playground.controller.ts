import { Controller } from '@nestjs/common'
import { Param }      from '@nestjs/common'
import { Res }        from '@nestjs/common'
import { Get }        from '@nestjs/common'
import fetch          from 'node-fetch'

const getJsdelivrUrl = (pathname: string) =>
  `https://cdn.jsdelivr.net/npm/@monstrs/grpc-playground-app/dist/${pathname}`

@Controller()
export class GrpcPlaygroundController {
  @Get()
  async index() {
    const response = await fetch(getJsdelivrUrl('index.html'))
    const content = await response.text()

    return content.replace(
      /\/_next\//g,
      'https://cdn.jsdelivr.net/npm/@monstrs/grpc-playground-app/dist/_next/'
    )
  }

  @Get('/_next/static/chunks/:chunk')
  async chunks(@Res() res, @Param('chunk') chunk: string) {
    res.redirect(getJsdelivrUrl(`_next/static/chunks/${chunk}`))
  }
}
