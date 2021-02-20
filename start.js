import System from './src/modules/system.js'
import { EVENTS } from './src/config/const.js'
import RequestHandler from './src/modules/request-handler.js'

System.setContext({
  admin: {
    overlord: {
      username: 'tim',
      password: '123456',
    },
  },
})
  .when(EVENTS.SERVER_INCOMING_REQUEST, RequestHandler)
  .start(() => {
    System.log.trace('System started')
  })
