import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
export const SRC_PATH = path.resolve(__dirname, '..')
/**
 * Any constants that are shared across the application
 * and that can be read at any point in time from
 * compile to runtime
 */

/**
 * The Version of the System as a whole. Does not need to match
 * what is in package.json. This is internal to the system
 */
export const VERSION = '1.0.0'

/**
 * How we can look into the global context for the context
 * of the System at large
 */
export const SYSTEM_CTX_PATH = 'system'
export const SERVER_PATH = 'server'
export const REQUEST_PATH = 'server.request'

export const EVENTS = {
  SYSTEM_STARTUP: 'system::startup',
  SYSTEM_STOP: 'system::stop',
  SERVER_INCOMING_REQUEST: 'server::incoming::request',
  SERVER_RESPOND_TO_REQUEST: 'server::incomfing::request::response',
}
