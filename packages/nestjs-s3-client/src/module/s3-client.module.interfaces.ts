import type { AwsCredentialIdentity } from '@aws-sdk/types'

export interface S3ClientModuleOptions {
  endpoint?: string
  region?: string
  credentials?: AwsCredentialIdentity
}
