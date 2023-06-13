import type { S3ClientConfig }   from '@aws-sdk/client-s3'

import { AwsCredentialIdentity } from '@aws-sdk/types'
import { Inject }                from '@nestjs/common'
import { Injectable }            from '@nestjs/common'
import { fromEnv }               from '@aws-sdk/credential-providers'

import { S3_CLIENT_ENDPOINT }    from './s3-client.module.constants.js'
import { S3_CLIENT_REGION }      from './s3-client.module.constants.js'
import { S3_CLIENT_CREDENTIALS } from './s3-client.module.constants.js'

@Injectable()
export class S3ClientConfigFactory {
  constructor(
    @Inject(S3_CLIENT_ENDPOINT)
    private readonly endpoint?: string,
    @Inject(S3_CLIENT_REGION)
    private readonly region?: string,
    @Inject(S3_CLIENT_CREDENTIALS)
    private readonly credentials?: AwsCredentialIdentity
  ) {}

  createS3ClientOptions(): S3ClientConfig {
    return {
      endpoint: this.endpoint || process.env.S3_ENDPOINT,
      region: this.region || process.env.S3_REGION,
      credentials: this.credentials || fromEnv(),
      forcePathStyle: true,
    }
  }
}
