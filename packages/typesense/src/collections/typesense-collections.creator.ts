import { OnModuleInit }              from '@nestjs/common'
import { Injectable }                from '@nestjs/common'
import { Logger }                    from '@monstrs/logger'
import { Client }                    from 'typesense'

import { TypesenseMetadataRegistry } from '../metadata'

@Injectable()
export class TypesenseCollectionsCreator implements OnModuleInit {
  private readonly logger = new Logger(TypesenseCollectionsCreator.name)

  constructor(
    private readonly registry: TypesenseMetadataRegistry,
    private readonly typesense: Client
  ) {}

  async onModuleInit() {
    // eslint-disable-next-line no-restricted-syntax
    for (const target of this.registry.getTargets()) {
      const schema = this.registry.getSchemaByTarget(target)

      try {
        // eslint-disable-next-line no-await-in-loop
        await this.typesense.collections(schema!.name).retrieve()
      } catch (error) {
        if (error.httpStatus === 404) {
          // eslint-disable-next-line no-await-in-loop
          await this.typesense.collections().create(schema)
        }
      }
    }
  }
}