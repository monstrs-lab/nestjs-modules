import { GrpcOptions } from '@nestjs/microservices'

export interface GrpcPlaygroundModuleOptions {
  version?: string
  options: GrpcOptions['options']
}
