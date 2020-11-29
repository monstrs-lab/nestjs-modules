import { Body, Controller }      from '@nestjs/common'
import { Get, Post, HttpCode }   from '@nestjs/common'
import { TransformClassToPlain } from 'class-transformer'

import { ProtoRegistry }         from '../proto'

@Controller('grpc-proxy')
export class GrpcHttpProxyController {
  constructor(private readonly protoRegistry: ProtoRegistry) {}

  @Get('/schema')
  @TransformClassToPlain()
  schema() {
    return this.protoRegistry.getSchema()
  }

  @Post('/call')
  @HttpCode(200)
  call(@Body() body) {
    return this.protoRegistry
      .getClient(body.file, body.service)
      .call(body.method, body.request, body.metadata)
  }
}
