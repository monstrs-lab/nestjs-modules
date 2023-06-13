import type { ClassConstructor } from 'class-transformer'

import { ValidationPipe }        from '@nestjs/common'
import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

export class Validator {
  async transform<T>(metatype: T, value: object): Promise<T> {
    return plainToInstance(metatype as ClassConstructor<T>, value)
  }

  async validate<T>(value: object, metatype: T): Promise<T> {
    const transformed = await this.transform(metatype, value)

    const errors = await validate(transformed as object)

    if (errors.length > 0) {
      throw await new ValidationPipe().createExceptionFactory()(errors)
    }

    return transformed
  }
}
