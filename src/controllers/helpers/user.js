import { badRequest, userNotFound } from '../helpers/http.js'
import validator from 'validator'

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

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const userNotFoundResponse = () =>
  userNotFound({ message: 'User not found' })
