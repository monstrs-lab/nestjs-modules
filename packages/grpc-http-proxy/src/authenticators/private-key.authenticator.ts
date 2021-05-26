import { sign }           from 'jsonwebtoken'
import { promises as fs } from 'fs'

import { Authenticator }  from './authenticator.interface'

export class PrivateKeyAuthenticator implements Authenticator {
  constructor(private readonly privateKey?: string) {
    if (!this.privateKey) {
      throw new Error('PrivateKeyAuthenticator: private key not found')
    }
  }

  async execute() {
    if (this.privateKey) {
      const privateKey = await fs.readFile(this.privateKey, 'utf-8')

      const token = sign({ sub: 'test' }, privateKey, { algorithm: 'RS256' })

      return `Bearer ${token}`
    }

    return null
  }
}
