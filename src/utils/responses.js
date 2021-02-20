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
