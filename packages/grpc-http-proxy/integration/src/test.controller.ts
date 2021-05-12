import { Controller }       from '@nestjs/common'
import { GrpcMethod }       from '@nestjs/microservices'
import { GrpcStreamMethod } from '@nestjs/microservices'
import { Subject }          from 'rxjs'

@Controller()
export class TestController {
  @GrpcMethod('TestService', 'Test')
  test({ id }) {
    return {
      id,
    }
  }

  @GrpcMethod('TestService', 'TestError')
  testError({ id }) {
    throw new Error(id)
  }

  @GrpcStreamMethod('TestService', 'TestStream')
  testStream(request) {
    const response = new Subject()

    request.subscribe({
      complete: () => response.complete(),
      next: ({ id }) => {
        response.next({
          id,
        })
      },
    })

    return response.asObservable()
  }
}
