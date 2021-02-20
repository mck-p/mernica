import Koa from 'koa'
import KoaLogger from 'koa-pino-logger'
import { v4 as uuid } from 'uuid'
import * as Env from '../../../config/env.js'
import {
  EVENTS,
  SERVER_PATH,
  REQUEST_PATH,
  REQUEST_CONTEXT_PATH,
} from '../../../config/const.js'
import { ERROR_NAMES_BY_CODE } from '../../../utils/errors.js'
import { respond_to_request } from '../../../utils/events.js'

import * as Context from '../../context.js'
import Renderer from '../../renderer.js'

import RequestHandler from './request-handler.js'

const error_handler = ({ logger }) => async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    logger.warn({ err }, 'Middleware Error')

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
}

const set_ctx = () => async (ctx, next) => {
  ctx.request_id = uuid()
  ctx.set('X-Request-ID', ctx.request_id)
  // Set the context for anyone that cares
  Context.set(SERVER_PATH, {})

  Context.set(REQUEST_PATH, {
    ctx,
    request_id: ctx.request_id,
  })

  await Context.run(async () => {
    await next()
  })
}

const await_bus = ({ bus, logger }) => async (ctx) => {
  const [status, headers, body] = await new Promise((res, rej) => {
    // ensure we respond within TIMEOUT
    let responded = false
    const REQUEST_TIMEOUT = Env.request_timeout
    // The first person to response wins!
    bus.once(respond_to_request(), (tuple) => {
      responded = true

      logger.trace({ tuple }, 'System responding')

      res(tuple)
    })

    // We tell everyone about it
    bus.emit(EVENTS.SERVER_INCOMING_REQUEST)

    // And then give them TIMEOUT to respond
    setTimeout(() => {
      if (!responded) {
        rej(new Error(`Did not respond within Timeout of ${REQUEST_TIMEOUT}ms`))
      }
    }, REQUEST_TIMEOUT)
  })

  ctx.status = status

  ctx.set(headers)

  ctx.body = typeof body === 'function' ? await body() : body
}

/**
 * @typedef {Object} ServerSetupConfig
 *
 * @prop {Koa} server
 * @prop {import('pino').Logger} logger
 * @prop {import('events').EventEmitter} bus
 */

/**
 * @typedef {Object} ServerConfig
 *
 * @prop {import('pino').Logger} logger
 * @prop {import('events').EventEmitter} bus
 */

/**
 *
 * @param {Object} config
 * @param {import('pino').Logger} config.logger
 * @param {import('events').EventEmitter} config.bus
 * @param {function(function():void): void} config.start
 * @param {function(function():void):void} config.stop
 */
const register = ({ bus, logger, start, stop }) => {
  /**
   * Once the system starts, we want to
   * start listening and open our port
   */
  bus.once(EVENTS.SYSTEM_STARTUP, async () => {
    await new Promise((res) => start(res))
  })

  /**
   * Once the system stops, we need to
   * stop listening and close our port
   */
  bus.once(EVENTS.SYSTEM_STOP, async () => {
    await new Promise((res) => stop(res))
  })

  /**
   * Listen for any incoming requests
   */
  bus.on(EVENTS.SERVER_INCOMING_REQUEST, RequestHandler)
}

/**
 * Sets up a server for consumption
 *
 * @param {ServerSetupConfig} config
 * @returns {Koa}
 */
const setup_server = ({ server, logger, bus }) =>
  server
    .use(error_handler({ logger }))
    .use(async (ctx, next) => {
      const start = Date.now()

      await next()

      ctx.set('X-Request-Time', Date.now() - start)
    })
    .use(set_ctx())
    .use(KoaLogger({ logger }))
    .use(Renderer())
    .use(await_bus({ logger, bus }))

class Server {
  #server
  #instance

  /**
   *
   * @param {ServerConfig} config
   */
  constructor({ logger, bus }) {
    this.#server = setup_server({
      server: new Koa(),
      bus,
      logger,
    })

    register({
      logger,
      bus,
      start: this.start.bind(this),
      stop: this.stop.bind(this),
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
