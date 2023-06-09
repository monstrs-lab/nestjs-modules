import type { ValidationPipeOptions } from '@nestjs/common'

import { ValidationPipe }             from '@nestjs/common'

import { validationExceptionFactory } from '../exception-factories/index.js'

export class BufValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...(options || {}),
      transform: typeof options?.transform === 'undefined' ? true : options?.transform,
      exceptionFactory: validationExceptionFactory || options?.exceptionFactory,
    })
  }
}
