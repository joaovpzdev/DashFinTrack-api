import { ok, serverError } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation.js'
import { UserNotFoundError } from '../../errors/user.js'

export class DeleteUserController {
  constructor(DeleteUserUseCase) {
    this.DeleteUserUseCase = DeleteUserUseCase
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const idIsValid = checkIfIdIsValid(userId)
      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const deletedUser = await this.DeleteUserUseCase.execute(userId)

      return ok(deletedUser)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }
      console.log(error)
      return serverError()
    }
  }
}
