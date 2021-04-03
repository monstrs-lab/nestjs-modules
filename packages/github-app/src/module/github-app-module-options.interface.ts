import { ModuleMetadata, Type } from '@nestjs/common/interfaces'
import { Octokit }              from '@octokit/core'

export interface GitHubAppModuleOptions {
  appId: number | string
  privateKey: string
  webhooks?: {
    secret: string
  }
  oauth?: {
    clientId: string
    clientSecret: string
    allowSignup?: boolean
  }
  Octokit?: typeof Octokit
}

export interface GitHubAppOptionsFactory {
  createGitHubAppOptions(): Promise<GitHubAppModuleOptions> | GitHubAppModuleOptions
}

export interface GitHubAppModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<GitHubAppOptionsFactory>
  useClass?: Type<GitHubAppOptionsFactory>
  useFactory?: (...args: any[]) => Promise<GitHubAppModuleOptions> | GitHubAppModuleOptions
  inject?: any[]
}
