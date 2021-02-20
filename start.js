import System from './src/modules/system.js'
import { EVENTS } from './src/config/const.js'

import * as ApplicationEventHandlers from './src/modules/events.js'

System.setContext({
  admin: {
    overlord: {
      username: 'tim',
      password: '123456',
    },
  },
}).once(
  EVENTS.SYSTEM_STARTUP,
  System.trace(() => {
    System.log.info('System has stated successfully')
  }, 'STARTUP')
)

for (const [event, handler] of Object.values(ApplicationEventHandlers)) {
  System.when(event, System.trace(handler, event))
}

System.start()
