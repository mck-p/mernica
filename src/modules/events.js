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
import {
  EVENTS,
  REQUEST_CONTEXT_PATH,
  REQUEST_PATH,
  SYSTEM_CTX_PATH,
} from '../config/const.js'
import { pug, json } from '../utils/responses.js'
import * as Context from '../modules/context.js'
import { respond_to_request } from '../modules/adapters/http/utils.js'
import * as MoodRepo from './ports/repositories/Mood.js'

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

export const render_not_found = [
  EVENTS.RENDER_NOT_FOUND,
  () => {
    // we respond to the request with a pug response
    System.trigger(respond_to_request(), pug('404', { title: 'Not Found' }))
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

export const record_mood = [
  EVENTS.RECORD_MOOD,
  async () => {
    const body = Context.get(REQUEST_CONTEXT_PATH).request.body

    const value = await MoodRepo.add(body)

    System.trigger(
      respond_to_request(),
      json({
        status: 201,
        data: value,
      })
    )
  },
]

export const read_mood = [
  EVENTS.READ_MOOD,
  async () => {
    const { params } = Context.get(SYSTEM_CTX_PATH)
    const { id } = params
    const data = await MoodRepo.getById(id)

    System.trigger(
      respond_to_request(),
      json({
        status: 200,
        data,
      })
    )
  },
]
