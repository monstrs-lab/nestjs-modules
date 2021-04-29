import { GrpcOptions } from '@nestjs/microservices'

export interface GrpcPlaygroundModuleOptions {
  options: GrpcOptions['options']
}
