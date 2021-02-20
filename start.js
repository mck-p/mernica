import System from './src/modules/system.js'
import { EVENTS } from './src/config/const.js'
import * as Context from './src/modules/context.js'
import { json } from './src/utils/responses.js'

System.setContext({
  admin: {
    overlord: {
      username: 'tim',
      password: '123456',
    },
  },
})
  .start(() => {
    System.log.trace('System started')
  })
  .when(EVENTS.SERVER_INCOMING_REQUEST, () => {
    const CTX = Context.read()

    if (CTX.server.request.ctx.path === '/api') {
      System.trigger(
        EVENTS.SERVER_RESPOND_TO_REQUEST,
        json({
          status: 200,
          data: {
            message: 'You really made it!',
          },
        })
      )
    }
  })
