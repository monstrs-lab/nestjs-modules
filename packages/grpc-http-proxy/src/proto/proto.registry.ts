import { OnApplicationBootstrap }         from '@nestjs/common'
import { Injectable, Inject }             from '@nestjs/common'
import get                                from 'lodash.get'

import { GRPC_HTTP_PROXY_MODULE_OPTIONS } from '../module'
import { GrpcHttpProxyModuleOptions }     from '../module'
import { ProtoClient }                    from './proto.client'
import { ProtoSchema }                    from './proto.schema'

@Injectable()
export class ProtoRegistry implements OnApplicationBootstrap {
  // @ts-ignore
  private schema: ProtoSchema

  constructor(
    @Inject(GRPC_HTTP_PROXY_MODULE_OPTIONS) private readonly options: GrpcHttpProxyModuleOptions
  ) {}

  async onApplicationBootstrap() {
    this.schema = await ProtoSchema.load(this.options.protoPath, this.options.loader)
  }

  getSchema(): ProtoSchema {
    return this.schema
  }

  getClient(fileName: string, serviceName: string): ProtoClient {
    const file = this.schema.getFile(fileName)

    if (!file) {
      throw new Error(`Proto file ${fileName} not found`)
    }

    const ServiceClient: any = get(file.ast, serviceName)

    if (!ServiceClient) {
      throw new Error('GRPC service not found')
    }

    return ProtoClient.create(this.options.url, ServiceClient)
  }
}
