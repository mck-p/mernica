import System from './src/modules/system.js'
import { EVENTS, REQUEST_PATH, SYSTEM_CTX_PATH } from './src/config/const.js'
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
  .when(EVENTS.SERVER_KICKOFF_DEMO, () => {
    const { ctx, request_id } = Context.get(REQUEST_PATH)

    System.trigger(
      `${EVENTS.SERVER_RESPOND_TO_REQUEST}:${request_id}`,
      json({
        status: 201,
        data: {
          message: 'You caused an event to trigger another event!',
          ctx: {
            handler: ctx.handler,
            params: ctx.params,
          },
        },
        headers: {
          'X-Num-Events': 2,
        },
      })
    )
  })
  .start(() => {
    System.log.trace('System started')
  })
