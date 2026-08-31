import { badRequest, ok, serverError } from '../helpers/http.js'
import { updateUserSchema } from '../../../schemas/index.js'
import { ZodError } from 'zod'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation.js'
import { EmailAlreadyExistsError, UserNotFoundError } from '../../errors/user.js'

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

      await updateUserSchema.parseAsync(params)

      const updatedUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updatedUser)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }

      if (error instanceof EmailAlreadyExistsError) {
        return badRequest({ message: error.message })
      }

      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message })
      }

      console.error(error)
      return serverError()
    }
  }
}