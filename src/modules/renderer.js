import path from 'path'
import Views from 'koa-views'
import { SRC_PATH } from '../config/const.js'

export default () =>
  Views(path.resolve(SRC_PATH, 'views'), { autoRender: false })
