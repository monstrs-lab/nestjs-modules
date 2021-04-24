import path            from 'path'
import { Transport }   from '@nestjs/microservices'
import { GrpcOptions } from '@nestjs/microservices'

export const serverOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['grpc.reflection.v1alpha'],
    protoPath: [path.join(__dirname, '../../proto/grpc/reflection/v1alpha/reflection.proto')],
    url: '0.0.0.0:50051',
    loader: {
      arrays: true,
      keepCase: false,
      defaults: true,
      oneofs: true,
      includeDirs: [],
    },
  },
}
