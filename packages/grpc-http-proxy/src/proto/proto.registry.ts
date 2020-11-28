import { OnApplicationBootstrap }         from '@nestjs/common'
import { Injectable, Inject }             from '@nestjs/common'
import { load }                           from '@grpc/proto-loader'
import { loadPackageDefinition }          from 'grpc'
import { Service }                        from 'protobufjs'
import { Root }                           from 'protobufjs'
import path                               from 'path'
import { promises as fs }                 from 'fs'
import get                                from 'lodash.get'

import { walkServices }                   from './proto.utils'
import { ProtoFile, ProtoService }        from './proto.interfaces'
import { GRPC_HTTP_PROXY_MODULE_OPTIONS } from '../module'
import { GrpcHttpProxyModuleOptions }     from '../module'
import { ProtoClient }                    from './proto.client'

@Injectable()
export class ProtoRegistry implements OnApplicationBootstrap {
  private schema: ProtoFile[] = []

  constructor(
    @Inject(GRPC_HTTP_PROXY_MODULE_OPTIONS) private readonly options: GrpcHttpProxyModuleOptions
  ) {}

  async onApplicationBootstrap() {
    this.schema = await this.loadProtos()
  }

  getSchema(): ProtoFile[] {
    return this.schema
  }

  getClient(serviceName: string): ProtoClient {
    const schema = this.schema.find((item) =>
      item.services.find((service) => service.name === serviceName)
    )

    if (!schema) {
      throw new Error('Service not found')
    }

    const ServiceClient: any = get(schema.ast, serviceName)

    if (!ServiceClient) {
      throw new Error('GRPC service not found')
    }

    return ProtoClient.create(this.options.url, ServiceClient)
  }

  private async loadProtos(): Promise<ProtoFile[]> {
    const protoPaths = Array.isArray(this.options.protoPath)
      ? this.options.protoPath
      : [this.options.protoPath]

    return Promise.all(
      protoPaths.map((protoPath) => this.fromFileName(protoPath, this.options.loader))
    )
  }

  private parseServices(root, ast) {
    const services: ProtoService[] = []

    walkServices({ root, ast }, (service: Service, _: any, serviceName: string) => {
      services.push({
        name: serviceName,
        methods: service.methods,
      })
    })

    return services
  }

  private async fromFileName(protoPath: string, options): Promise<ProtoFile> {
    const packageDefinition = await load(protoPath, options)
    const ast = loadPackageDefinition(packageDefinition)

    const root = new Root()

    await root.load(protoPath, options)

    const source = await fs.readFile(protoPath, 'utf-8')

    const services = this.parseServices(root, ast)

    return {
      name: path.basename(protoPath),
      path: protoPath,
      definition: root.toJSON(),
      source,
      ast,
      root,
      services,
    }
  }
}
