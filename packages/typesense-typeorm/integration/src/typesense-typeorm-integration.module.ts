import { Module }                 from '@nestjs/common'
import { TypeOrmModule }          from '@nestjs/typeorm'
import { TypesenseModule }        from '@monstrs/nestjs-typesense'

import { TypesenseTypeOrmModule } from '../../src'
import { TestEntity }             from './test.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [TestEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TestEntity]),
    TypesenseModule.register(),
    TypesenseTypeOrmModule.register(),
  ],
  providers: [TestEntity],
  exports: [TypeOrmModule],
})
export class TypesenseTypeOrmIntegrationModule {}