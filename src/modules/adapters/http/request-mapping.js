import { EVENTS } from '../../../config/const.js'

import { is_api, is_home } from './utils.js'

/**
 * Map external RESTful requests into internal,
 * BUS events
 */

export default [
  [is_home, EVENTS.RENDER_HOME],
  [is_api, EVENTS.RENDER_API],
]
