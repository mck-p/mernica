import R from 'ramda'

import {
  PATH_OF_REQUEST_PATH,
  REQUEST_CONTEXT_PATH,
  EVENTS,
} from '../../../config/const.js'

import * as Context from '../../context.js'
import System from '../../system.js'

import RequestMappings from './request-mapping.js'

const set_context = (transformer, after) => [
  transformer,
  (path) =>
    after(
      System.setContext({
        handler: 'http',
        query: Context.get(REQUEST_CONTEXT_PATH).query,
        ...transformer(path),
      })
    ),
]

// /**
//  * Use this if you are just understanding how this adapter works
//  * or want to answer the requests immediately here and not
//  * push it to the Application at large
//  */
// const DEMO_HANDLERS = [
//   /**
//    * You can render Pug templates
//    */
//   set_context(is_home, (system) =>
//     system.trigger(respond_to_request(), pug('home', { title: 'Home Page' }))
//   ),
//   /**
//    * You can render JSON
//    */
//   set_context(is_api, (system) =>
//     system.trigger(
//       respond_to_request(),
//       json({
//         status: 200,
//         data: {
//           message: 'You really made it!',
//         },
//       })
//     )
//   ),
//   /**
//    * You can offload the handling of the request
//    * to a different event or even multiple. This
//    * will can be as many events deep as you want as
//    * long as one of them calls respond to request
//    * within TIMEOUT
//    */
//   set_context(is_multiple_events, (system) =>
//     system.trigger(EVENTS.SERVER_KICKOFF_DEMO)
//   ),
//   /**
//    * You can even get fancy and have one request await
//    * another specific request, if that is important to you
//    * for some reason. This sort of awaiting another request
//    * to come in before resolving should only be used in the
//    * most extreme instances and will still be under the TIMEOUT
//    * rule.
//    */
//   set_context(is_awaiting_another_event, (system) => {
//     // Use closures to ensure you are handling the correct
//     // state if you are awaiting another request!
//     const current_request_id = Context.get(REQUEST_PATH).request_id

//     system.once(EVENTS.SERVER_SECOND_REQUEST, () => {
//       system.trigger(
//         `${EVENTS.SERVER_RESPOND_TO_REQUEST}:${current_request_id}`,
//         json({
//           status: 200,
//           data: {
//             message:
//               'You caused an event to await for another event to fire before responding!',
//           },
//         })
//       )
//     })
//   }),
//   set_context(is_another_event, (system) => {
//     system.trigger(
//       respond_to_request(),
//       json({
//         status: 202,
//         data: {
//           mesasge: 'Will process the other request after yours',
//         },
//       })
//     )

//     system.trigger(EVENTS.SERVER_SECOND_REQUEST)
//   }),
// ]

export default () =>
  R.cond(
    RequestMappings.map(([transformer, new_event]) =>
      set_context(transformer, (system) => {
        // If you are straight mapping event to event
        if (typeof new_event === 'string') {
          return system.trigger(new_event)
        }

        // else we need to desctruct
        const { method = 'get', event } = new_event

        // and ensure that the method matches
        const reqMethod = Context.get(REQUEST_CONTEXT_PATH).request.method

        if (reqMethod.toLowerCase() !== method.toLowerCase()) {
          return system.trigger(EVENTS.RENDER_NOT_FOUND)
        }

        return system.trigger(event)
      })
    )
  )(Context.get(PATH_OF_REQUEST_PATH))
