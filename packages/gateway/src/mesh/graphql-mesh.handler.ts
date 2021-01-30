import { Inject }                 from '@nestjs/common'
import { OnModuleInit }           from '@nestjs/common'
import { Injectable }             from '@nestjs/common'
import { HttpAdapterHost }        from '@nestjs/core'
import { getMesh }                from '@graphql-mesh/runtime'

import { GATEWAY_MODULE_OPTIONS } from '../module'
import { GatewayModuleOptions }   from '../module'
import { GraphQLMeshConfig }      from './graphql-mesh.config'
import { graphqlExpressHandler }  from './graphql-express.handler'

@Injectable()
export class GraphQLMeshHandler implements OnModuleInit {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly config: GraphQLMeshConfig,
    @Inject(GATEWAY_MODULE_OPTIONS)
    private readonly options: GatewayModuleOptions
  ) {}

  async onModuleInit() {
    const meshConfig = this.config.create()

    const { schema, contextBuilder } = await getMesh(meshConfig)

    if (this.adapterHost.httpAdapter.getType() === 'express') {
      const instance = this.adapterHost.httpAdapter.getInstance()

      instance.post(this.options.path || '/', graphqlExpressHandler(schema, contextBuilder))
    } else {
      throw new Error('Only express engine available')
    }
  }
}
