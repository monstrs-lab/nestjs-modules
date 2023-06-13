import type { ClassConstructor } from 'class-transformer'

import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

import { ValidationError }       from '../errors/index.js'

export class Validator {
  async transform<T>(metatype: ClassConstructor<unknown>, value: object): Promise<T> {
    return plainToInstance(metatype, value) as T
  }

  async validate<T>(value: object, metatype: ClassConstructor<unknown>): Promise<T> {
    const transformed = await this.transform<T>(metatype, value)

    const errors = await validate(transformed as object)

    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    return transformed
  }
}
