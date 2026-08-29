import { badRequest, ok } from './helpers/http.js'
import { generateInvalidPasswordResponse, generateInvalidEmailResponse, generateInvalidIdResponse, checkIfPasswordIsValid, checkIfEmailIsValid, checkIfIdIsValid  } from './helpers/user.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'


export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id

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
      const updateUserUseCase = new UpdateUserUseCase()

      const updatedUser = await updateUserUseCase.execute(userId, params)
      
      return ok(updatedUser)
    } catch (error) {
      console.log(error)
      return badRequest({ message: 'Internal server error' })
    }
  }
}
