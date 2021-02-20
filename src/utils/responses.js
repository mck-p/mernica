import * as Context from '../modules/context.js'

export const json = ({ status, data, error, meta, headers = {} }) => [
  status,
  {
    'Content-Type': 'application/json',
    ...headers,
  },
  {
    data,
    error,
    meta,
  },
]

export const pug = (template, values = {}) => [
  200,
  {
    'Content-Type': 'text/html',
  },
  () => {
    const CTX = Context.read()
    const ctx = CTX.server.request.ctx

    return ctx.render(`${template}.pug`, values)
  },
]
