import { LoginFlow, RecoveryFlow }        from '@oryd/kratos-client'
import { RegistrationFlow, SettingsFlow } from '@oryd/kratos-client'
import { VerificationFlow }               from '@oryd/kratos-client'
import { RegistrationFlowMethodConfig }   from '@oryd/kratos-client'
import { LoginFlowMethodConfig }          from '@oryd/kratos-client'
import { RecoveryFlowMethodConfig }       from '@oryd/kratos-client'
import { SettingsFlowMethodConfig }       from '@oryd/kratos-client'
import { VerificationFlowMethodConfig }   from '@oryd/kratos-client'

export type MethodConfigFlow =
  | LoginFlow
  | RegistrationFlow
  | RecoveryFlow
  | SettingsFlow
  | VerificationFlow

export type MethodConfig =
  | RegistrationFlowMethodConfig
  | LoginFlowMethodConfig
  | RecoveryFlowMethodConfig
  | SettingsFlowMethodConfig
  | VerificationFlowMethodConfig

export const methodConfig = (flow: MethodConfigFlow, key: string): MethodConfig | null => {
  if (flow.active && flow.active !== key) {
    return null
  }

  if (!flow.methods[key]) {
    return null
  }

  const { config } = flow.methods[key]

  return config
}
