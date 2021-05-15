import { Controller }    from '@nestjs/common'
import { Body }          from '@nestjs/common'
import { Post }          from '@nestjs/common'
import { HttpCode }      from '@nestjs/common'
import { Param }         from '@nestjs/common'
import { Header }        from '@nestjs/common'
import { ErrorStatus }   from '@monstrs/grpc-error-status'
import BJSON             from 'buffer-json'

import { ProtoRegistry } from '../proto'

@Controller('grpc-proxy')
export class GrpcHttpProxyController {
  constructor(private readonly protoRegistry: ProtoRegistry) {}

  @HttpCode(200)
  @Post('/:service/:method')
  @Header('Content-Type', 'application/json')
  async call(@Param('service') service, @Param('method') method, @Body() body) {
    try {
      const data = await this.protoRegistry.getClient(service).call(method, body, {})

      return BJSON.stringify(data)
    } catch (error) {
      return BJSON.stringify(ErrorStatus.fromServiceError(error).toObject())
    }
  }
}
