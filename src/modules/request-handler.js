import R from 'ramda'

import { json, pug } from '../utils/responses.js'
import { is_api, is_home } from '../utils/is-path.js'
import { EVENTS, PATH_OF_REQUEST_PATH } from '../config/const.js'
import * as Context from './context.js'
import System from './system.js'

export default () =>
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
  ])(Context.get(PATH_OF_REQUEST_PATH))
