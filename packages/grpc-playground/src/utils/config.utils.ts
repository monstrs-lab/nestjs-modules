import { GrpcOptions }        from '@nestjs/microservices'

import { REFLECTION_PACKAGE } from 'nestjs-grpc-reflection'

// eslint-disable-next-line
declare const __non_webpack_require__: any

const REFLECTION_PROTO =
  typeof __non_webpack_require__ === 'undefined'
    ? require.resolve(
        'nestjs-grpc-reflection/dist/grpc-reflection/proto/grpc/reflection/v1alpha/reflection.proto'
      )
    : require('nestjs-grpc-reflection/dist/grpc-reflection/proto/grpc/reflection/v1alpha/reflection.proto')
        .default

export const addReflectionToGrpcConfig = (config: GrpcOptions): GrpcOptions => {
  const protoPath = Array.isArray(config.options.protoPath)
    ? config.options.protoPath
    : [config.options.protoPath]
  const pkg = Array.isArray(config.options.package)
    ? config.options.package
    : [config.options.package]

  return {
    ...config,
    options: {
      ...config.options,
      protoPath: [...protoPath, REFLECTION_PROTO],
      package: [...pkg, REFLECTION_PACKAGE],
    },
  }
}
