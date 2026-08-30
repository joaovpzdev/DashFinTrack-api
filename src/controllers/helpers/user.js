import { badRequest, userNotFound } from '../helpers/http.js'


export const generateInvalidPasswordResponse = () => {
  return badRequest({
    message: 'Password must be at least 6 characters long',
  })
}

export const generateInvalidEmailResponse = () => {
  return badRequest({
    message: 'Invalid email format',
  })
}


export const userNotFoundResponse = () =>
  userNotFound({ message: 'User not found' })
