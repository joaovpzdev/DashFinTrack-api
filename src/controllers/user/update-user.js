import { badRequest, ok } from '../helpers/http.js'
import {
  generateInvalidPasswordResponse,
  generateInvalidEmailResponse,
  generateInvalidIdResponse,
  userNotFoundResponse,
  checkIfPasswordIsValid,
  checkIfEmailIsValid,
  checkIfIdIsValid,
} from '../helpers/user.js'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }
      const params = httpRequest.body
      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )
      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some fields are not allowed' })
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)

        if (!passwordIsValid) {
          return generateInvalidPasswordResponse()
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email)
        if (!emailIsValid) {
          return generateInvalidEmailResponse()
        }
      }
      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      if (!updatedUser) {
        return userNotFoundResponse()
      }

      return ok(updatedUser)
    } catch (error) {
      console.log(error)
      return badRequest({ message: 'Internal server error' })
    }
  }
}
