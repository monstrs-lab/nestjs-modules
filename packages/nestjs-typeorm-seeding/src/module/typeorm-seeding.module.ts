import { SeederFactory } from '@monstrs/typeorm-seeding'
import { DynamicModule } from '@nestjs/common'
import { Module }        from '@nestjs/common'

import { DataSource }    from 'typeorm'

@Module({})
export class TypeOrmSeedingModule {
  static register(): DynamicModule {
    const seederFactoryProvider = {
      provide: SeederFactory,
      useFactory: (dataSource: DataSource) => new SeederFactory({ dataSource }),
      inject: [DataSource],
    }

    return {
      global: true,
      module: TypeOrmSeedingModule,
      providers: [seederFactoryProvider],
      exports: [seederFactoryProvider],
    }
  }
}
