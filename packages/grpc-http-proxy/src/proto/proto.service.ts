/* eslint-disable max-classes-per-file */

import { Service } from 'protobufjs'

export class ProtoServiceMethod {
  name: string

  requestType: string

  responseType: string

  constructor(name: string, requestType: string, responseType: string) {
    this.name = name
    this.requestType = requestType
    this.responseType = responseType
  }
}

export class ProtoService {
  name: string

  methods: ProtoServiceMethod[]

  constructor(name: string, methods: ProtoServiceMethod[]) {
    this.name = name
    this.methods = methods
  }

  static create(name: string, service: Service) {
    const methods = Object.keys(service.methods).map((methodName) => {
      const method = service.methods[methodName]

      return new ProtoServiceMethod(method.name, method.requestType, method.responseType)
    })

    return new ProtoService(name, methods)
  }
}
