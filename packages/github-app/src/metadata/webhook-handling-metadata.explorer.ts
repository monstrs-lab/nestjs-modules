import { Injectable, OnModuleInit }        from '@nestjs/common'
import { DiscoveryService }                from '@nestjs/core'
import { ExternalContextCreator }          from '@nestjs/core/helpers/external-context-creator'
import { ParamMetadata }                   from '@nestjs/core/helpers/interfaces/params-metadata.interface'
import { InstanceWrapper }                 from '@nestjs/core/injector/instance-wrapper'
import { MetadataScanner }                 from '@nestjs/core/metadata-scanner'

import { WEBHOOK_HANDLER_ARGS_METADATA }   from '../decorators'
import { WebhookHandlerParamsFactory }     from './webhook-handler-params.factory'
import { WebhookHandlingMetadataAccessor } from './webhook-handling-metadata.accessor'
import { WebhookHandlingMetadataRegistry } from './webhook-handling-metadata.registry'

@Injectable()
export class WebhookHandlingMetadataExplorer implements OnModuleInit {
  private readonly webhookHandlerParamsFactory = new WebhookHandlerParamsFactory()

  constructor(
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: WebhookHandlingMetadataAccessor,
    private readonly metadataRegistry: WebhookHandlingMetadataRegistry
  ) {}

  onModuleInit() {
    this.explore()
  }

  explore() {
    const providers: InstanceWrapper[] = this.discoveryService.getProviders()

    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper

      if (!instance || !Object.getPrototypeOf(instance)) {
        return
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupWebhookHandlers(instance, key)
      )
    })
  }

  lookupWebhookHandlers(instance: Record<string, Function>, key: string) {
    const metadata = this.metadataAccessor.getWebhookHandlerMetadata(instance[key])

    if (metadata) {
      const handler = this.createCallbackHandler(instance, key)

      this.metadataRegistry.addWebhookHandler(metadata.name, handler)
    }
  }

  createCallbackHandler(instance, key) {
    const paramsFactory = this.webhookHandlerParamsFactory
    const contextOptions = undefined

    return this.externalContextCreator.create<Record<number, ParamMetadata>, 'webhooks'>(
      instance,
      instance[key],
      key,
      WEBHOOK_HANDLER_ARGS_METADATA,
      paramsFactory,
      undefined,
      undefined,
      contextOptions,
      'webhooks'
    )
  }
}
