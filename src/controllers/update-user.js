import { badRequest, ok } from './helper.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import validator from 'validator'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.id

      const isIdValid = validator.isUUID(userId)
      if (!isIdValid) {
        return badRequest({ message: 'Invalid user ID' })
      }

      const updateParams = httpRequest.body
      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(updateParams).some(
        (field) => !allowedFields.includes(field),
      )
      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some fields are not allowed' })
      }

      if (updateParams.password) {
        const passwordIsNotValid = updateParams.password.length < 6

        if (passwordIsNotValid) {
          return badRequest({
            message: 'Password must be at least 6 characters long',
          })
        }
      }

      if (updateParams.email) {
        const emailIsValid = validator.isEmail(updateParams.email)
        if (!emailIsValid) {
          return badRequest({ message: 'Invalid email format' })
        }
      }
      const updateUserUseCase = new UpdateUserUseCase()

      const updatedUser = await updateUserUseCase.execute(userId, updateParams)
      
      return ok(updatedUser)
    } catch (error) {
      console.log(error)
      return badRequest({ message: 'Internal server error' })
    }
  }
}
