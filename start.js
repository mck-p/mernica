import System from './src/modules/system.js'
import * as ApplicationEventHandlers from './src/modules/events.js'

System.setContext({
  admin: {
    overlord: {
      username: 'tim',
      password: '123456',
    },
  },
})

// If you want to use the KICKOFF Demo handler
// System.when(EVENTS.SERVER_KICKOFF_DEMO, () => {
//   const { ctx, request_id } = Context.get(REQUEST_PATH)

//   System.trigger(
//     `${EVENTS.SERVER_RESPOND_TO_REQUEST}:${request_id}`,
//     json({
//       status: 201,
//       data: {
//         message: 'You caused an event to trigger another event!',
//         ctx: {
//           handler: ctx.handler,
//           params: ctx.params,
//         },
//       },
//       headers: {
//         'X-Num-Events': 2,
//       },
//     })
//   )
// })

// If you want to use the Handlers Mappings
for (const [event, handler] of Object.values(ApplicationEventHandlers)) {
  System.when(event, handler)
}

System.start(() => {
  System.log.trace('System started')
})
