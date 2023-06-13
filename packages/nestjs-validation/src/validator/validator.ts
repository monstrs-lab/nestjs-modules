import type { ClassConstructor } from 'class-transformer'

import { ValidationPipe }        from '@nestjs/common'
import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

export class Validator {
  async transform<T extends ClassConstructor<T>>(metatype: T, value: object): Promise<T> {
    return plainToInstance(metatype, value)
  }

  async validate<T extends ClassConstructor<T>>(value: object, metatype: T): Promise<T> {
    const transformed = await this.transform(metatype, value)

    const errors = await validate(transformed)

    if (errors.length > 0) {
      throw await new ValidationPipe().createExceptionFactory()(errors)
    }

    return transformed
  }
}
