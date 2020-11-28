import { INamespace } from 'protobufjs'
import { Method }     from 'protobufjs'
import { Root }       from 'protobufjs'
import { GrpcObject } from 'grpc'

export interface ProtoFile {
  ast: GrpcObject
  name: string
  path: string
  source: string
  definition: INamespace
  root: Root
  services: ProtoService[]
}

export interface ProtoServiceList {
  [key: string]: ProtoService
}

export interface ProtoServiceMethods {
  [key: string]: Method
}

export interface ProtoService {
  name: string
  methods: ProtoServiceMethods
}
