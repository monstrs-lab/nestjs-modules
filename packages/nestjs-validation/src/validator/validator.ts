import type { ClassConstructor } from 'class-transformer'

import { ValidationPipe }        from '@nestjs/common'
import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

export class Validator {
  async transform<T>(metatype: ClassConstructor<unknown>, value: object): Promise<T> {
    return plainToInstance(metatype, value) as T
  }

  async validate<T>(value: object, metatype: ClassConstructor<unknown>): Promise<T> {
    const transformed = await this.transform<T>(metatype, value)

    const errors = await validate(transformed as object)

    if (errors.length > 0) {
      throw await new ValidationPipe().createExceptionFactory()(errors)
    }

    return transformed
  }
}
