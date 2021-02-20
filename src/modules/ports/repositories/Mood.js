import { v4 as uuid } from 'uuid'
const state = new Map()

export const add = (mood) => {
  const id = uuid()

  state.set(id, mood)

  return {
    id,
    ...mood,
  }
}

export const getById = (id) => {
  const mood = state.get(id)

  if (!mood) {
    throw new Error(`Can not find mood by id "${id}"`)
  }

  return {
    id,
    ...mood,
  }
}
