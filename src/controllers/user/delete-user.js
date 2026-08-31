import { userNotFoundResponse } from '../helpers/user.js'
import { ok, serverError } from '../helpers/http.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation.js'

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

      if (!deletedUser) {
        return userNotFoundResponse()
      }
      return ok(deletedUser)
      
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
