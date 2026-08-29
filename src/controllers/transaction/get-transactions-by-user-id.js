import { userNotFoundResponse } from '../helpers/user.js'
import { ok, serverError } from '../helpers/http.js'
import { UserNotFoundError } from '../../errors/user.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  requiredFieldIsMissingResponse,
} from '../helpers/validation.js'

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
  }
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      if (!userId) {
        return requiredFieldIsMissingResponse('userId')
      }

      const userIdIsValid = checkIfIdIsValid(userId)

      if (!userIdIsValid) {
        return generateInvalidIdResponse()
      }

      const transactions =
        await this.getTransactionsByUserIdUseCase.execute(userId)

      return ok(transactions)
    } catch (error) {
      console.log(error)

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
