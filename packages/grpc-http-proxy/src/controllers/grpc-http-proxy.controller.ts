import { Body, Controller, Get, Post } from '@nestjs/common'

import { ProtoRegistry }               from '../proto'

@Controller('grpc-proxy')
export class GrpcHttpProxyController {
  constructor(private readonly protoRegistry: ProtoRegistry) {}

  @Get('/schema')
  schema() {
    return this.protoRegistry.getSchema()
  }

  @Post('/call')
  call(@Body() body) {
    return this.protoRegistry.getClient(body.service).call(body.method, body.request, body.metadata)
  }
}
