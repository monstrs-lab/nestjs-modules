export class KratosRedirectRequiredException extends Error {
  constructor(public readonly redirectTo: string) {
    super('Kratos redirect required')
  }
}
