import Koa from 'koa'
import KoaLogger from 'koa-pino-logger'
import * as Env from '../../config/env.js'
import {
  SYSTEM_CTX_PATH,
  EVENTS,
  SERVER_PATH,
  REQUEST_PATH,
} from '../../config/const.js'
import { ERROR_NAMES_BY_CODE } from '../../utils/errors.js'
import * as Context from '../context.js'
import Renderer from '../renderer.js'

class Server {
  #server
  #logger
  #instance

  constructor({ logger, bus }) {
    this.#server = new Koa()
    this.#logger = logger

    this.#server
      .use(async (ctx, next) => {
        try {
          await next()
        } catch (err) {
          this.#logger.warn({ err }, 'Middleware Error')

          if (ERROR_NAMES_BY_CODE.ResponseTimeout === err.code) {
            ctx.status = 404
            ctx.body = {
              error: {
                message:
                  'Could not find a handler for that within time. Try again or change your path.',
              },
            }
          } else {
            ctx.status = 500
            ctx.body = { error: { message: 'Internal Server Error' } }
          }
        }
      })
      .use(async (ctx, next) => {
        Context.set(SERVER_PATH, {})
        Context.set(REQUEST_PATH, { ctx })

        await next()
      })
      .use(KoaLogger({ logger }))
      .use(Renderer())
      .use(async (ctx) => {
        const [status, headers, body] = await new Promise((res, rej) => {
          // ensure we respond within TIMEOUT
          let responded = false
          const REQUEST_TIMEOUT = Env.request_timeout

          // The first person to response wins!
          bus.once(EVENTS.SERVER_RESPOND_TO_REQUEST, (tuple) => {
            responded = true

            this.#logger.trace({ tuple }, 'System responding')

            res(tuple)
          })

          // We tell everyone about it
          bus.emit(EVENTS.SERVER_INCOMING_REQUEST, ctx)

          // And then give them TIMEOUT to respond
          setTimeout(() => {
            if (!responded) {
              rej(
                new Error(
                  `Did not respond within Timeout of ${REQUEST_TIMEOUT}ms`
                )
              )
            }
          }, REQUEST_TIMEOUT)
        })

        ctx.status = status

        ctx.set(headers)

        ctx.body = body
      })

    bus.once(EVENTS.SYSTEM_STARTUP, async () => {
      const ctx = Context.get(SYSTEM_CTX_PATH)
      this.#logger.trace({ ctx }, 'Starting Server with context')

      await new Promise((res) => this.start(res))
    })

    bus.once(EVENTS.SYSTEM_STOP, async () => {
      const ctx = Context.get(SYSTEM_CTX_PATH)
      this.#logger.trace({ ctx }, 'Stopping Server with context')

      await new Promise((res) => this.start(res))
    })
  }

  start(cb) {
    if (!this.#instance) {
      this.#instance = this.#server.listen(Env.port, cb)
    } else {
      process.nextTick(cb)
    }

    return this
  }

  stop(cb) {
    if (this.#instance) {
      this.#instance.close(cb)

      this.#instance = null
    } else {
      process.nextTick(cb)
    }

    return this
  }
}

export default Server
