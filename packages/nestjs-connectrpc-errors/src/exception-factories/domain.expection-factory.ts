import type { DomainError } from '@monstrs/core-errors'

import { Code }             from '@connectrpc/connect'
import { ConnectError }     from '@connectrpc/connect'
import { RpcException }     from '@nestjs/microservices'

export const domainExceptionFactory = (error: DomainError): RpcException =>
  new RpcException(new ConnectError(error.message, Code.InvalidArgument))
