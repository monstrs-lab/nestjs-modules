import { Inject }                 from '@nestjs/common'
import { OnModuleInit }           from '@nestjs/common'
import { OnModuleDestroy }        from '@nestjs/common'
import { Injectable }             from '@nestjs/common'
import { HttpAdapterHost }        from '@nestjs/core'
import { ApolloServer }           from 'apollo-server-express'

import { GATEWAY_MODULE_OPTIONS } from '../module'
import { GatewayModuleOptions }   from '../module'
import { GraphQLMesh }            from './graphql.mesh'
import { formatError }            from './format.error'

@Injectable()
export class GraphQLMeshHandler implements OnModuleInit, OnModuleDestroy {
  private apolloServer!: ApolloServer

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly mesh: GraphQLMesh,
    @Inject(GATEWAY_MODULE_OPTIONS)
    private readonly options: GatewayModuleOptions
  ) {}

  async onModuleInit() {
    const { schema, contextBuilder } = await this.mesh.getInstance()

    if (this.adapterHost.httpAdapter.getType() === 'express') {
      const app = this.adapterHost.httpAdapter.getInstance()

      const { path = '/', playground, introspection, cors } = this.options

      const apolloServer = new ApolloServer({
        schema,
        introspection: introspection === undefined ? Boolean(playground) : introspection,
        context: contextBuilder,
        playground,
        formatError,
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
