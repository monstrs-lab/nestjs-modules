import { Controller }    from '@nestjs/common'
import { Body }          from '@nestjs/common'
import { Post }          from '@nestjs/common'
import { HttpCode }      from '@nestjs/common'
import { Param }         from '@nestjs/common'

import { ProtoRegistry } from '../proto'

@Controller('grpc-proxy')
export class GrpcHttpProxyController {
  constructor(private readonly protoRegistry: ProtoRegistry) {}

  @HttpCode(200)
  @Post('/:service/:method')
  call(@Param('service') service, @Param('method') method, @Body() body) {
    return this.protoRegistry.getClient(service).call(method, body, {})
  }
}
