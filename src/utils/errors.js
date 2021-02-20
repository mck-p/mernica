const ERROR_CODES_TUPLES = [
  ['NotImplemented', 1000],
  ['CannotSetValue', 1001],
  ['ResponseTimeout', 10002],
]

export const ERROR_CODES_BY_NAME = ERROR_CODES_TUPLES.reduce(
  (a, c) => ({
    ...a,
    [c[0]]: c[1],
  }),
  {}
)

export const ERROR_NAMES_BY_CODE = ERROR_CODES_TUPLES.reduce(
  (a, c) => ({
    ...a,
    [c[1]]: c[0],
  }),
  {}
)
export class NotImplemented extends Error {
  constructor(functionName) {
    super()

    this.message = `You did not implemented the "${functionName}" function ya silly head!`

    this.code = ERROR_CODES_BY_NAME.NotImplemented
  }
}

export class CannotSetValue extends Error {
  constructor(name) {
    super()

    this.message = `You cannot set the value for the member "${name}". It is a wrapper around an internal method and is get only.`

    this.code = ERROR_CODES_BY_NAME.CannotSetValue
  }
}

export class ResponseTimeout extends Error {
  constructor(path, timeout) {
    super()

    this.message = `The server did not respond within ${timeout}ms for the path "${path}".`
    this.code = ERROR_CODES_BY_NAME.ResponseTimeout
  }
}
