/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { LoggerService } from '@nestjs/common'

import { Logger }             from '@monstrs/logger'

export class NestLogger implements LoggerService {
  private logger = new Logger('nestjs')

  public log(message: any, context?: string): void {
    if (context) {
      this.logger.child(context).info(message)
    } else {
      this.logger.info(message)
    }
  }

  public error(message: any, trace?: string, context?: string): void {
    if (context) {
      this.logger.child(context).error(message, { '@stack': trace })
    } else {
      this.logger.error(message, { '@stack': trace })
    }
  }

  public warn(message: any, context?: string): void {
    if (context) {
      this.logger.child(context).warn(message)
    } else {
      this.logger.warn(message)
    }
  }

  public debug(message: any, context?: string): void {
    if (context) {
      this.logger.child(context).debug(message)
    } else {
      this.logger.debug(message)
    }
  }

  public verbose?(message: any, context?: string): void {
    if (context) {
      this.logger.child(context).trace(message)
    } else {
      this.logger.trace(message)
    }
  }
}
