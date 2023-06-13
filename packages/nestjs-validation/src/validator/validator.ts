import type { ClassConstructor } from 'class-transformer'
import type { ValidationError }  from 'class-validator'

import { ValidationPipe }        from '@nestjs/common'
import { plainToInstance }       from 'class-transformer'
import { validate }              from 'class-validator'

export class Validator {
  async transform(metatype: ClassConstructor<unknown>, value: object): Promise<typeof metatype> {
    return plainToInstance(metatype, value) as typeof metatype
  }

  async validate(
    value: object,
    metatype: ClassConstructor<unknown>,
    exceptionFactory?: (validationErrors?: Array<ValidationError> | undefined) => unknown
  ): Promise<typeof metatype> {
    const transformed = await this.transform(metatype, value)

    const errors = await validate(transformed as object)

    if (errors.length > 0) {
      if (exceptionFactory) {
        throw exceptionFactory(errors)
      } else {
        throw await new ValidationPipe().createExceptionFactory()(errors)
      }
    }

    return transformed
  }
}
