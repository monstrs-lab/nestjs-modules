import { ProtoFile } from './proto.file'

export class ProtoSchema {
  files: ProtoFile[]

  constructor(files: ProtoFile[]) {
    this.files = files
  }

  static async load(protoPath: string | string[], options) {
    const protoPaths = Array.isArray(protoPath) ? protoPath : [protoPath]

    const files = await Promise.all(protoPaths.map((proto) => ProtoFile.load(proto, options)))

    return new ProtoSchema(files)
  }

  getFile(fileName: string) {
    return this.files.find((file) => file.name === fileName)
  }
}
