import { badRequest, ok } from '../helpers/http.js'
import { updateUserSchema } from '../../../schemas/index.js'
import { ZodError } from 'zod'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation.js'

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
      console.log(error)
      return badRequest({ message: 'Internal server error' })
    }
  }
}
