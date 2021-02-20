/**
 * Maps Internal Events into Event Handlers. This
 * is the Core of the application.
 *
 * Everything will come in as an event and exit as
 * an event. If you need to call multiple events in
 * order to render your request, you will need to
 * orchestrate that across the event handlers below
 * using Context or through event values.
 *
 * DO NOT keep state within any handler or within this
 * file directly
 */
import System from './system.js'
import { EVENTS } from '../config/const.js'
import { pug, json } from '../utils/responses.js'
import { respond_to_request } from '../modules/adapters/http/utils.js'

/**
 * when we receive a RENDER_HOME event
 */
export const render_home = [
  EVENTS.RENDER_HOME,
  () => {
    // we respond to the request with a pug response
    System.trigger(respond_to_request(), pug('home', { title: 'Home Page' }))
  },
]

/**
 * When we receive a RENDER_API event
 */
export const render_api = [
  EVENTS.RENDER_API,
  () => {
    // we respond with a json response
    System.trigger(
      respond_to_request(),
      json({
        status: 200,
        data: {
          message: 'You really made it!',
        },
      })
    )
  },
]
