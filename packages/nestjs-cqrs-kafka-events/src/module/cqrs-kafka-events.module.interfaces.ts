import type { ModuleMetadata } from '@nestjs/common/interfaces'
import type { Type }           from '@nestjs/common/interfaces'
import type { KafkaConfig }    from '@monstrs/nestjs-kafka'

export interface CqrsKafkaEventsModuleOptions extends Partial<KafkaConfig> {
  groupId?: string
}

export interface CqrsKafkaEventsOptionsFactory {
  createCqrsKafkaEventsOptions: () =>
    | CqrsKafkaEventsModuleOptions
    | Promise<CqrsKafkaEventsModuleOptions>
}

export interface CqrsKafkaEventsModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CqrsKafkaEventsOptionsFactory>
  useClass?: Type<CqrsKafkaEventsOptionsFactory>
  useFactory?: (
    ...args: Array<any>
  ) => CqrsKafkaEventsModuleOptions | Promise<CqrsKafkaEventsModuleOptions>
  inject?: Array<any>
}
