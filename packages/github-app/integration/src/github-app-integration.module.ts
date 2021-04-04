import { Module }          from '@nestjs/common'

import { GitHubAppModule } from '../../src'

@Module({
  imports: [
    GitHubAppModule.register({
      appId: 'test',
      privateKey: 'test',
      webhooks: {
        secret: 'mysecret',
      },
      oauth: {
        clientId: 'test',
        clientSecret: 'test',
      },
    }),
  ],
})
export class GitHubAppIntegrationModule {}
