import type { ValidationError as ValError } from '@nestjs/common'

import { Code }                             from '@bufbuild/connect'
import { ConnectError }                     from '@bufbuild/connect'
import { ValidationError }                  from '@monstrs/protobuf-rpc'
import { ValidationErrorMessage }           from '@monstrs/protobuf-rpc'
import { RpcException }                     from '@nestjs/microservices'

const traverseErrors = (
  errors: Array<ValError> = [],
  callback: (error: ValError, id: string, property: string) => void,
  path: string[] = []
) => {
  errors.forEach((error) => {
    const currentPath = [...path, error.property]

    if (error.constraints) {
      callback(error, currentPath.join('.'), error.property)
    }

    traverseErrors(error.children, callback, currentPath)
  })
}

export const validationExceptionFactory = (errors: Array<ValError>) => {
  const validationErrors: Array<ValidationError> = []

  traverseErrors(errors, (error, id, property) => {
    const messages = Object.keys(error.constraints || {}).map((constraintId) => {
      const validationErrorMessage = new ValidationErrorMessage({
        id: constraintId,
        constraint: error.constraints![constraintId],
      })

      return validationErrorMessage
    })

    validationErrors.push(
      new ValidationError({
        id,
        property,
        messages,
      })
    )
  })

  return new RpcException(
    new ConnectError('Request validation failed', Code.InvalidArgument, undefined, validationErrors)
  )
}
