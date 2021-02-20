import R from 'ramda'

import {
  PATH_OF_REQUEST_PATH,
  REQUEST_CONTEXT_PATH,
  EVENTS,
} from '../../../config/const.js'

import * as Context from '../../context.js'
import System from '../../system.js'

import RequestMappings from './request-mapping.js'

const set_context = (transformer, after) => [
  transformer,
  (path) =>
    after(
      System.setContext({
        handler: 'http',
        query: Context.get(REQUEST_CONTEXT_PATH).query,
        ...transformer(path),
      })
    ),
]

export default () =>
  R.cond(
    RequestMappings.map(([transformer, new_event]) =>
      set_context(transformer, (system) => {
        // If you are straight mapping event to event
        if (typeof new_event === 'string') {
          return system.trigger(new_event)
        }

        // else we need to desctruct
        const { method = 'get', event } = new_event

        // and ensure that the method matches
        const reqMethod = Context.get(REQUEST_CONTEXT_PATH).request.method

        if (reqMethod.toLowerCase() !== method.toLowerCase()) {
          return system.trigger(EVENTS.RENDER_NOT_FOUND)
        }

        return system.trigger(event)
      })
    )
  )(Context.get(PATH_OF_REQUEST_PATH))
