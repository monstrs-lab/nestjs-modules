/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-classes-per-file */

import 'reflect-metadata'

import { Module }                          from '@nestjs/common'
import { DiscoveryModule }                 from '@nestjs/core'
import { Test }                            from '@nestjs/testing'

import { WebhookHandler }                  from '../decorators'
import { WebhookPayload }                  from '../decorators'
import { WebhookHandlingMetadataAccessor } from './webhook-handling-metadata.accessor'
import { WebhookHandlingMetadataExplorer } from './webhook-handling-metadata.explorer'
import { WebhookHandlingMetadataRegistry } from './webhook-handling-metadata.registry'

describe('webhook-handling', () => {
  describe('metadata', () => {
    @Module({
      imports: [DiscoveryModule],
      providers: [
        WebhookHandlingMetadataAccessor,
        WebhookHandlingMetadataExplorer,
        WebhookHandlingMetadataRegistry,
      ],
    })
    class TestMetadataModule {}

    describe('webhook handler', () => {
      let module

      class TestTarget {
        @WebhookHandler('pull_request')
        testWebhook(@WebhookPayload webhook) {}
      }

      beforeEach(async () => {
        module = await Test.createTestingModule({
          imports: [TestMetadataModule],
          providers: [TestTarget],
        }).compile()

        await module.init()
      })

      afterEach(async () => {
        await module.close()
      })

      it('should store webhook handler metadata', async () => {
        expect(
          module.get(WebhookHandlingMetadataRegistry).getWebhookHandlers().get('pull_request')
        ).toBeDefined()
      })
    })
  })
})
