import { Controller }               from '@nestjs/common'
import { GrpcStreamMethod }         from '@nestjs/microservices'
import { Observable }               from 'rxjs'
import { Subject }                  from 'rxjs'
import { status }                   from 'grpc'

import { ServerReflectionRequest }  from '../../proto'
import { ServerReflectionResponse } from '../../proto'
import { GrpcServicesRegistry }     from '../grpc'

@Controller()
export class GrpcReflectionController {
  constructor(private readonly registry: GrpcServicesRegistry) {}

  @GrpcStreamMethod('ServerReflection', 'ServerReflectionInfo')
  info(request: Observable<ServerReflectionRequest>): Observable<ServerReflectionResponse> {
    const response = new Subject<ServerReflectionResponse>()

    const onNext = (reflectionRequest: ServerReflectionRequest) => {
      if (reflectionRequest.listServices) {
        response.next({
          validHost: '',
          originalRequest: reflectionRequest,
          listServicesResponse: this.registry.getListServices(),
        })
      }

      if (reflectionRequest.fileContainingSymbol) {
        const methodDefinition = this.registry.getMethodDefinitionFromServicesByFileContainingSymbol(
          reflectionRequest.fileContainingSymbol
        )

        if (methodDefinition) {
          const { fileDescriptorProtos } = methodDefinition.requestType

          response.next({
            validHost: '',
            originalRequest: reflectionRequest,
            fileDescriptorResponse: {
              fileDescriptorProto: fileDescriptorProtos,
            },
          })
        } else {
          response.next({
            validHost: '',
            originalRequest: reflectionRequest,
            errorResponse: {
              errorCode: status.NOT_FOUND,
              errorMessage: 'Definition not found',
            },
          })
        }
      }
    }

    request.subscribe({
      complete: () => response.complete(),
      next: onNext,
    })

    return response.asObservable()
  }
}
