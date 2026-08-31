import { badRequest } from '../helpers/http.js'
import validator from 'validator'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const generateInvalidIdResponse = () => {
  return badRequest({
    message: 'Invalid ID format',
  })
}

export const requiredFieldIsMissingResponse = (field) =>
    badRequest({
      message: `Missing required field: ${field}`,
    })





