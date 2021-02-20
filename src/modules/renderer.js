import path from 'path'
import Views from 'koa-views'
import compose from 'koa-compose'
import { SRC_PATH } from '../config/const.js'

export default () =>
  compose([
    Views(path.resolve(SRC_PATH, 'views')),
    (ctx, next) => {
      if (ctx.path === '/') {
        return ctx.render('home.pug', { title: 'Home' })
      }

      return next()
    },
  ])
