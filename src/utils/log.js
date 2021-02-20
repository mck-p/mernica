import pino from 'pino'
import { SYSTEM_CTX_PATH } from '../config/const.js'
import * as Context from '../modules/context.js'

export default pino({
  level: process.env.LOG_LEVEL || 'debug',
  serializers: pino.stdSerializers,
  redact: ['password', 'ctx.admin.*'],
  mixin: () => ({ ctx: Context.get(SYSTEM_CTX_PATH) }),
})
