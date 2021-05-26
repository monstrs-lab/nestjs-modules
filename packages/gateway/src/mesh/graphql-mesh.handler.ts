import { Inject }                 from '@nestjs/common'
import { OnModuleInit }           from '@nestjs/common'
import { OnModuleDestroy }        from '@nestjs/common'
import { Injectable }             from '@nestjs/common'
import { HttpAdapterHost }        from '@nestjs/core'
import { getMesh }                from '@graphql-mesh/runtime'
import { ApolloServer }           from 'apollo-server-express'

import { GATEWAY_MODULE_OPTIONS } from '../module'
import { GatewayModuleOptions }   from '../module'
import { GraphQLMeshConfig }      from './graphql-mesh.config'

@Injectable()
export class GraphQLMeshHandler implements OnModuleInit, OnModuleDestroy {
  private apolloServer!: ApolloServer

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
      const app = this.adapterHost.httpAdapter.getInstance()

      const { path = '/', playground, introspection, cors } = this.options

      const apolloServer = new ApolloServer({
        schema,
        introspection: introspection === undefined ? playground : introspection,
        playground,
        context: contextBuilder,
      })

      apolloServer.applyMiddleware({
        app,
        path,
        cors,
      })

      this.apolloServer = apolloServer
    } else {
      throw new Error('Only express engine available')
    }
  }

  async onModuleDestroy() {
    await this.apolloServer?.stop()
  }
}
