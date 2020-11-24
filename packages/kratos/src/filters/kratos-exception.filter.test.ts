import { ArgumentsHost }                   from '@nestjs/common'
import { HttpArgumentsHost }               from '@nestjs/common/interfaces/features/arguments-host.interface'

import { KratosRedirectRequiredException } from '../exceptions'
import { KratosExceptionFilter }           from './kratos-expection.filter'

describe('KratosExceptionFilter', () => {
  it('redirect on KratosFlowRequiredException', async () => {
    const filter = new KratosExceptionFilter({
      browser: 'http://localhost:3000',
      public: 'http://localhost:3000',
    })

    const response = {
      redirect: jest.fn(),
    }

    const argumentHost = {
      getResponse: () => response as any,
    }

    const host = {
      switchToHttp: () => argumentHost as HttpArgumentsHost,
    }

    filter.catch(new KratosRedirectRequiredException('/test'), host as ArgumentsHost)

    expect(response.redirect).toBeCalledWith('http://localhost:3000/test')
  })
})
