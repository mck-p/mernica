import R from 'ramda'

import System from './src/modules/system.js'
import { EVENTS } from './src/config/const.js'
import * as Context from './src/modules/context.js'
import { json, pug } from './src/utils/responses.js'
import { is_api, is_home } from './src/utils/is-path.js'

const request_handler = () =>
  R.cond([
    [
      is_api,
      () =>
        System.trigger(
          EVENTS.SERVER_RESPOND_TO_REQUEST,
          json({
            status: 200,
            data: {
              message: 'You really made it!',
            },
          })
        ),
    ],
    [
      is_home,
      () =>
        System.trigger(
          EVENTS.SERVER_RESPOND_TO_REQUEST,
          pug('home', { title: 'Home Page' })
        ),
    ],
    [
      R.T,
      () =>
        System.trigger(
          EVENTS.SERVER_RESPOND_TO_REQUEST,
          json({
            status: 404,
            error: {
              message: 'Not Found',
            },
            headers: {
              'X-Quick-Reply': true,
            },
          })
        ),
    ],
  ])(Context.get('server.request.ctx.path'))

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
  .when(EVENTS.SERVER_INCOMING_REQUEST, request_handler)
