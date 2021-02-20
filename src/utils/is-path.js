import { match } from 'path-to-regexp'

export const path_matches = (path_like) =>
  match(path_like, { decode: decodeURIComponent })

export const is_api = path_matches('/api')
export const is_home = path_matches('/')
export const is_multiple_events = path_matches('/demo/:id')
