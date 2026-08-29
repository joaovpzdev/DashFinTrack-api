import { badRequest } from '../helpers/http.js'
import validator from 'validator'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const generateInvalidIdResponse = () => {
  return badRequest({
    message: 'Invalid ID format',
  })
}

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field]
    const fieldIsEmpty =
      checkIfIdIsValid(params[field]) &&
      validator.isEmpty(params[field], {
        ignore_whitespace: true,
      })

    if (fieldIsMissing || fieldIsEmpty) {
      return {
        missingField: field,
        ok: false,
      }
    }
  }
  return {
    ok: true,
    missingField: undefined,
  }
}
