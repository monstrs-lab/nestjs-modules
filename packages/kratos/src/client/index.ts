import { PublicApi } from '@ory/kratos-client'
import { AdminApi }  from '@ory/kratos-client'

export * from '@ory/kratos-client'

export class KratosPublicApi extends PublicApi {}

export class KratosAdminApi extends AdminApi {}
