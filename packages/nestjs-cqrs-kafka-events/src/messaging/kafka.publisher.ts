import type { Kafka }           from '@monstrs/nestjs-kafka'
import type { Producer }        from '@monstrs/nestjs-kafka'
import type { RecordMetadata }  from '@monstrs/nestjs-kafka'
import type { IEventPublisher } from '@nestjs/cqrs'
import type { IEvent }          from '@nestjs/cqrs'

import { instanceToPlain }      from 'class-transformer'

export class KafkaPublisher implements IEventPublisher {
  private readonly kafkaProducer: Producer

  constructor(kafka: Kafka) {
    this.kafkaProducer = kafka.producer()
  }

  async disconnect(): Promise<void> {
    return this.kafkaProducer.disconnect()
  }

  async connect(): Promise<void> {
    await this.kafkaProducer.connect()
  }

  async publish(event: IEvent): Promise<Array<RecordMetadata>> {
    return this.kafkaProducer.send({
      topic: event.constructor.name,
      messages: [{ value: JSON.stringify(instanceToPlain(event)) }],
    })
  }

  async publishAll(events: Array<IEvent>): Promise<Array<RecordMetadata>> {
    return this.kafkaProducer.sendBatch({
      topicMessages: events.map((event) => ({
        topic: event.constructor.name,
        messages: [{ value: JSON.stringify(instanceToPlain(event)) }],
      })),
    })
  }
}
