import { EVENTS, REQUEST_PATH } from '../config/const.js'
import * as Context from '../modules/context.js'

export const respond_to_request = () =>
  `${EVENTS.SERVER_RESPOND_TO_REQUEST}:${Context.get(REQUEST_PATH).request_id}`
