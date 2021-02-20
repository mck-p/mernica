import { match } from 'path-to-regexp'
import { EVENTS, REQUEST_PATH } from '../../../config/const.js'
import * as Context from '../../context.js'
export const path_matches = (path_like) =>
  match(path_like, { decode: decodeURIComponent })

export const is_api = path_matches('/api')
export const is_home = path_matches('/')
export const is_mood = path_matches('/moods')
export const is_mood_by_id = path_matches('/moods/:id')

// Demo
// export const is_multiple_events = path_matches('/demo/:id')
// export const is_awaiting_another_event = path_matches('/request/start')
// export const is_another_event = path_matches('/request/stop')

export const respond_to_request = () =>
  `${EVENTS.SERVER_RESPOND_TO_REQUEST}:${Context.get(REQUEST_PATH).request_id}`
