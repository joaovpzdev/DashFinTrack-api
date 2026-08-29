import { ok, serverError } from '../helpers/http.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  userNotFoundResponse,
} from '../helpers/user.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async execute(httpRequest) {
    try {
      const isValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isValid) {
        return generateInvalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      )

      if (!user) {
        return userNotFoundResponse()
      }

      return ok(user)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
