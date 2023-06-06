import { UsePipes }            from '@nestjs/common'
import { UseFilters }          from '@nestjs/common'
import { BufMethod }           from '@wolfcoded/nestjs-bufconnect'
import { BufService }          from '@wolfcoded/nestjs-bufconnect'

import { BufValidationPipe }   from '../../src/index.js'
import { BufExceptionsFilter } from '../../src/index.js'
import { TestService }         from '../gen/test_connect.js'
import { TestDto }             from './test.dto.js'

@BufService(TestService)
@UseFilters(BufExceptionsFilter)
export class TestController {
  @BufMethod()
  @UsePipes(new BufValidationPipe())
  testValidation({ id }: TestDto): { id: string } {
    return {
      id,
    }
  }
}
