import { AsyncLocalStorage } from 'async_hooks'
import R from 'ramda'

const ctx = new AsyncLocalStorage()

/**
 * Start with an empty context
 */
ctx.enterWith({})

const split = R.split('.')

/**
 * Reads a specific path in the context
 *
 * @param {string} path dot.separated.path for the value in the context to read
 * @returns {*} the value at that path
 */
export const get = (path) => R.path(split(path), ctx.getStore())

/**
 * Sets a specific value at a specific path in the context
 *
 * @param {string} path dot.separated.path for the value in the context to set
 * @param {*} value the value to set at that path
 */
export const set = (path, value) =>
  ctx.enterWith(R.assocPath(split(path), value, ctx.getStore()))

/**
 * Reads the current context
 *
 * @returns {Object<string, *>}
 */
export const read = () => ctx.getStore()

export const run = (fn) => ctx.run(read(), fn)
