import R from 'ramda'
import EE from 'events'
import { v4 as uuid } from 'uuid'
import Log from '../utils/log.js'
import { VERSION, SYSTEM_CTX_PATH, EVENTS } from '../config/const.js'
import * as Errors from '../utils/errors.js'
import * as Context from './context.js'

import Server from './adapters/http/index.js'

class System {
  #server
  #events
  #logger
  #context
  constructor() {
    this.#context = {}

    this.#logger = Log.child({ system_version: VERSION })
    this.#events = new EE({ captureRejections: true })
    this.#server = new Server({ logger: this.#logger, bus: this.#events })
  }

  get log() {
    return this.#logger
  }

  set log(_) {
    throw new Errors.CannotSetValue('System.log')
  }

  setContext(state) {
    this.#context = R.mergeDeepLeft(state, this.#context)
    return this
  }

  start(cb = () => {}) {
    this.trigger(EVENTS.SYSTEM_STARTUP)

    process.nextTick(cb)

    return this
  }

  stop(cb = () => {}) {
    this.trigger(EVENTS.SYSTEM_STOP)

    process.nextTick(cb)

    return this
  }

  trigger(event, ...args) {
    Context.set(SYSTEM_CTX_PATH, this.#context)

    this.#logger.trace({ event, args }, 'Triggering Event')

    this.#events.emit(event, ...args)

    return this
  }

  when(event, fn) {
    this.#logger.trace({ event, fn }, 'Regsitering Event Handler')
    this.#events.on(event, fn)

    return this
  }

  once(event, fn) {
    this.#logger.trace({ event, fn }, 'Regsitering a Once Handler')
    this.#events.once(event, fn)

    return this
  }

  trace(fn, name) {
    return (...args) => {
      const id = uuid()

      this.#logger.trace(
        { function_name: `${name}::HANDLER`, id },
        'Calling function'
      )

      const value = fn(...args)

      this.#logger.trace(
        { function_name: `${name}::HANDLER`, value },
        'Function finished'
      )

      return value
    }
  }
}

export default new System()
