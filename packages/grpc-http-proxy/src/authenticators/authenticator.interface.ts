import { Request } from 'express'

export interface Authenticator {
  execute(req: Request): Promise<string | null>
}
