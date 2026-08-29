import { DeleteUserUseCase } from '../use-cases/delete-user.js'
import { checkIfIdIsValid, userNotFoundResponse } from './helpers/user.js'
import { ok, serverError } from './helpers/http.js'   
import { generateInvalidIdResponse } from './helpers/user.js'

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const idIsValid = checkIfIdIsValid(userId)
      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()
      const deletedUser = await deleteUserUseCase.execute(userId)

      if(!deletedUser) {
          return userNotFoundResponse()
      }

      return ok(deletedUser)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}