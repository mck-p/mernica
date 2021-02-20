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

/**
 * How we cna look into the global context for the context
 * of the Server and its Current Request
 */
export const SERVER_PATH = 'server'
export const REQUEST_PATH = `${SERVER_PATH}.request`
export const REQUEST_CONTEXT_PATH = `${REQUEST_PATH}.ctx`
export const PATH_OF_REQUEST_PATH = `${REQUEST_CONTEXT_PATH}.path`

export const EVENTS = {
  SYSTEM_STARTUP: 'system::startup',
  SYSTEM_STOP: 'system::stop',

  SERVER_INCOMING_REQUEST: 'server::incoming::request',
  SERVER_RESPOND_TO_REQUEST: 'server::incomfing::request::response',
  SERVER_KICKOFF_DEMO: 'server::kickoff::demo',
  SERVER_SECOND_REQUEST: 'server::second::request',

  RENDER_HOME: 'render::pug::home',
  RENDER_API: 'render::json::api',
  RENDER_NOT_FOUND: 'render::not::found',

  RECORD_MOOD: 'record::new::mood',
  READ_MOOD: 'read::mood',
}
