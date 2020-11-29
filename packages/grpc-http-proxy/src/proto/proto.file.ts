import { Exclude }               from 'class-transformer'
import { Expose }                from 'class-transformer'
import { load }                  from '@grpc/proto-loader'
import { loadPackageDefinition } from 'grpc'
import { GrpcObject }            from 'grpc'
import { Service }               from 'protobufjs'
import { Root }                  from 'protobufjs'
import { INamespace }            from 'protobufjs'
import path                      from 'path'
import { promises as fs }        from 'fs'

import { walkServices }          from './proto.utils'
import { ProtoService }          from './proto.service'

@Exclude()
export class ProtoFile {
  @Expose()
  name: string

  path: string

  @Expose()
  source: string

  root: Root

  @Expose()
  descriptor: INamespace

  ast: GrpcObject

  @Expose()
  services: ProtoService[]

  constructor(
    name: string,
    filePath: string,
    source: string,
    root: Root,
    ast: GrpcObject,
    services: ProtoService[]
  ) {
    this.name = name
    this.path = filePath
    this.source = source
    this.root = root
    this.descriptor = root.toJSON()
    this.ast = ast
    this.services = services
  }

  static async load(protoPath: string, options) {
    const packageDefinition = await load(protoPath, options)
    const ast = loadPackageDefinition(packageDefinition)

    const root = new Root()

    await root.load(protoPath, options)

    const source = await fs.readFile(protoPath, 'utf-8')

    const services: ProtoService[] = []

    walkServices({ root, ast }, (service: Service, _, serviceName: string) => {
      services.push(ProtoService.create(serviceName, service))
    })

    return new ProtoFile(path.basename(protoPath), protoPath, source, root, ast, services)
  }
}
