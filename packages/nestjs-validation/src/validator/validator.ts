import type { ClassConstructor } from 'class-transformer'

import { ValidationPipe }        from '@nestjs/common'
import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

export class Validator {
  async transform(metatype: ClassConstructor<unknown>, value: object): Promise<unknown> {
    return plainToInstance(metatype, value)
  }

  async validate(value: object, metatype: ClassConstructor<unknown>): Promise<unknown> {
    const transformed = await this.transform(metatype, value)

    const errors = await validate(transformed as object)

    if (errors.length > 0) {
      throw await new ValidationPipe().createExceptionFactory()(errors)
    }

    return transformed
  }
}
