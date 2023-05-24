import type { MikroOrmModuleOptions } from '@mikro-orm/nestjs'

import { MikroORMLogger }             from '@monstrs/mikro-orm-logger'
import { Logger }                     from '@monstrs/logger'

export class MikroORMConfigBuilder {
  static build(options: Partial<MikroOrmModuleOptions>): MikroOrmModuleOptions {
    return {
      driver: options.driver,
      port: options.port || 5432,
      host: options.host || process.env.DB_HOST || 'localhost',
      dbName: options.dbName || process.env.DB_DATABASE || 'db',
      user: options.user || process.env.DB_USERNAME || 'postgres',
      password: options.password || process.env.DB_PASSWORD || 'password',
      migrations: options.migrations,
      entities: options.entities,
      debug: options.debug,

      loggerFactory: (opts) => new MikroORMLogger(opts),
      logger: (message) => {
        new Logger('mikro-orm:migrations').info(message)
      },
    }
  }
}
