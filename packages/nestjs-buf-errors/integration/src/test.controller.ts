import { UseFilters }          from '@nestjs/common'
import { BufMethod }           from '@wolfcoded/nestjs-bufconnect'
import { BufService }          from '@wolfcoded/nestjs-bufconnect'

import { Validator }           from '@monstrs/nestjs-validation'

import { BufExceptionsFilter } from '../../src/index.js'
import { TestService }         from '../gen/test_connect.js'
import { TestPayload }         from './test.payload.js'

@BufService(TestService)
@UseFilters(BufExceptionsFilter)
export class TestController {
  constructor(private readonly validator: Validator) {}

  @BufMethod()
  async testValidation(request: { id: string }): Promise<{ id: string }> {
    const payload: TestPayload = await this.validator.validate(request, TestPayload)

    return {
      id: payload.id,
    }
  }
}
