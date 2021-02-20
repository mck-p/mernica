/**
 * This file holds all of the environment variables that can be
 * used, along with any default values. These values should be
 * accessible during runtime of the application
 */

/**
 * Ensures that a value is available from the process environment
 * or it throws an error
 * 
 * @param {string} key The key from process.env to get
 * @param {*} fallback The fallback value to use. If undefined, will be treated as not given
 */
export const ensure = (key, fallback) => {
  if (!(key in process.env)) {
    if (typeof fallback === 'undefined') {
      throw new Error(`process.env.${key} does not exist and no fallback given`)
    }

    return fallback
  }

  return process.env[key]
}

export const ensure_bool = (key, fallback) => {
  const value = ensure(key, fallback)

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return Boolean(value)
}

export const node_env = ensure('NODE_ENV', 'development')
export const is_prod = node_env === 'production'
export const is_stage = node_env === 'staging'
export const is_dev = node_env === 'development'
export const is_test = node_env === 'test'

export const log_level = ensure('LOG_LEVEL', 'trace')
export const port = ensure('PORT')
export const jwt_secret = ensure('JWT_SECRET')
export const cookie_secret = ensure('COOKIE_SECRET')

export const bus_errors_are_fatal = ensure_bool('FATAL_BUS_ERRORS')