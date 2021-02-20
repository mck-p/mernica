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

for (const [event, handler] of Object.values(ApplicationEventHandlers)) {
  System.when(event, handler)
}

System.start(() => {
  System.log.trace('System started')
})
