import { Injectable }          from '@nestjs/common'
import { ServiceDefinition }   from '@grpc/proto-loader'
import { MethodDefinition }    from '@grpc/proto-loader'
import { FileDescriptorProto } from 'google-protobuf/google/protobuf/descriptor_pb'

@Injectable()
export class GrpcServicesRegistry {
  public readonly services: Array<ServiceDefinition> = []

  getServiceNameFromServiceDefinition(serviceDefinition: ServiceDefinition) {
    const methodDefinition = Object.values(serviceDefinition).shift()

    return methodDefinition!.path.split('/')[1]
  }

  addService(service: ServiceDefinition) {
    this.services.push(service)
  }

  getListServices() {
    return {
      service: this.services.map((serviceDefinition) => ({
        name: this.getServiceNameFromServiceDefinition(serviceDefinition),
      })),
    }
  }

  getIfFileDescriptorContainsFileContainingSymbol(
    fileDescriptor: FileDescriptorProto,
    fileContainingSymbol: string
  ) {
    const packageName = fileDescriptor.getPackage()

    return fileContainingSymbol.includes(packageName)
  }

  getMethodDefinitionFromServicesByFileContainingSymbol(fileContainingSymbol) {
    return this.services.reduce<MethodDefinition<any, any> | undefined>(
      (methodDefinition, service) => {
        if (typeof methodDefinition !== 'undefined') {
          return methodDefinition
        }

        return Object.values(service).find((method) => {
          const isFileContainingSymbolInService =
            method.requestType.fileDescriptorProtos.findIndex((fileDescriptorProto) => {
              const fdp = FileDescriptorProto.deserializeBinary(fileDescriptorProto)

              return this.getIfFileDescriptorContainsFileContainingSymbol(fdp, fileContainingSymbol)
            }) !== -1

          return isFileContainingSymbolInService
        })
      },
      undefined
    )
  }
}
