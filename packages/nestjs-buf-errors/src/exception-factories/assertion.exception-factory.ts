import type { AssertionError } from 'node:assert'

import { Code }                from '@bufbuild/connect'
import { ConnectError }        from '@bufbuild/connect'
import { RpcException }        from '@nestjs/microservices'

export const assertionExceptionFactory = (error: AssertionError) =>
  new RpcException(new ConnectError(error.message, Code.InvalidArgument))
