import type { Consumer }       from '@monstrs/nestjs-kafka'
import type { Kafka }          from '@monstrs/nestjs-kafka'
import type { IEvent }         from '@nestjs/cqrs'
import type { IMessageSource } from '@nestjs/cqrs'
import type { Subject }        from 'rxjs'

import { plainToInstance }     from 'class-transformer'

export class KafkaSubscriber implements IMessageSource {
  private readonly kafkaConsumer: Consumer

  private bridge!: Subject<any>

  constructor(kafka: Kafka, groupId: string) {
    this.kafkaConsumer = kafka.consumer({ groupId })
  }

  async disconnect(): Promise<void> {
    return this.kafkaConsumer.disconnect()
  }

  async connect(events: Array<FunctionConstructor>): Promise<void> {
    await this.kafkaConsumer.connect()

    for await (const event of events) {
      await this.kafkaConsumer.subscribe({ topic: event.name, fromBeginning: false })
    }

    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, message }) => {
        if (this.bridge) {
          for (const Event of events) {
            if (Event.name === topic) {
              const parsedJson = plainToInstance(
                Event,
                JSON.parse(message.value!.toString()) as unknown
              )
              const receivedEvent: IEvent = Object.assign(new Event(), parsedJson)

              this.bridge.next(receivedEvent)
            }
          }
        }
      },
    })
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any {
    this.bridge = subject
  }
}
