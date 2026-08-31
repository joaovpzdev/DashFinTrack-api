import { userNotFound } from '../helpers/http.js'

export const userNotFoundResponse = () =>
  userNotFound({ message: 'User not found' })
