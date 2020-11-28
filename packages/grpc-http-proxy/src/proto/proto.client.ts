import { credentials }  from 'grpc'
import { Metadata }     from 'grpc'
import { ServiceError } from 'grpc'
import { Client }       from 'grpc'

export class ProtoClient {
  constructor(private readonly client: Client) {}

  static create(url: string = '0.0.0.0:50051', ServiceClient) {
    return new ProtoClient(new ServiceClient(url, credentials.createInsecure(), {}))
  }

  call(method: string, request, meta = {}) {
    const metadata = new Metadata()

    Object.keys(meta).forEach((key) => {
      metadata.add(key, meta[key])
    })

    return new Promise((resolve, reject) => {
      this.client[method](request, metadata, (error: ServiceError, response) => {
        if (error) {
          reject(error)
        } else {
          resolve(response)
        }
      })
    })
  }
}
