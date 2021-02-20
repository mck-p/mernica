import R from 'ramda'

import { json, pug } from '../../../utils/responses.js'
import { is_api, is_home, is_multiple_events } from '../../../utils/is-path.js'
import { EVENTS, PATH_OF_REQUEST_PATH } from '../../../config/const.js'
import * as Context from '../../context.js'
import System from '../../system.js'

const set_context = (transformer, after) => (path) =>
  after(
    System.setContext({
      handler: 'http',
      ...transformer(path),
    })
  )

export default () =>
  R.cond([
    [
      is_multiple_events,
      set_context(is_multiple_events, (system) =>
        system.trigger(EVENTS.SERVER_KICKOFF_DEMO)
      ),
    ],
    [
      is_api,
      set_context(is_api, (system) =>
        system.trigger(
          EVENTS.SERVER_RESPOND_TO_REQUEST,
          json({
            status: 200,
            data: {
              message: 'You really made it!',
            },
          })
        )
      ),
    ],
    [
      is_home,
      set_context(is_home, (system) =>
        system.trigger(
          EVENTS.SERVER_RESPOND_TO_REQUEST,
          pug('home', { title: 'Home Page' })
        )
      ),
    ],
    [
      R.T,
      set_context(
        () => ({ params: {}, query: {} }),
        (system) =>
          system.trigger(
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
          )
      ),
    ],
  ])(Context.get(PATH_OF_REQUEST_PATH))
