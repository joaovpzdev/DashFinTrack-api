import { ok, serverError } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import { UserNotFoundError } from '../../errors/user.js'
import { checkIfIdIsValid } from '../helpers/validation.js'

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

        const idIsValid = checkIfIdIsValid(userId)
        if (!idIsValid) {
          return userNotFoundResponse()
        }

        const balance = await this.getUserBalanceUseCase.execute(userId )

        return ok(balance)
        
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      console.log(error)
      return serverError()
    }
  }
}
