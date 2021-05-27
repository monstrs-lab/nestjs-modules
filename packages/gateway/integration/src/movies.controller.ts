import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

@Controller()
export class MoviesController {
  @GrpcMethod('ExampleService', 'getMovies')
  getMovies(_, metadata) {
    return {
      result: [
        {
          name: 'Mission: Impossible Rogue Nation',
          rating: 0.97,
          year: 2015,
        },
      ],
    }
  }

  @GrpcMethod('ExampleService', 'GetMetadata')
  getMetadata(_, metadata) {
    return metadata.getMap()
  }
}
