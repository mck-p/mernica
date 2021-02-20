import { EVENTS } from '../../../config/const.js'

import { is_api, is_home, is_mood, is_mood_by_id } from './utils.js'

/**
 * Map external RESTful requests into internal,
 * BUS events
 */

export default [
  [is_home, EVENTS.RENDER_HOME],
  [is_api, EVENTS.RENDER_API],
  [
    is_mood,
    {
      method: 'post',
      event: EVENTS.RECORD_MOOD,
    },
  ],
  [
    is_mood_by_id,
    {
      method: 'get',
      event: EVENTS.READ_MOOD,
    },
  ],
]
