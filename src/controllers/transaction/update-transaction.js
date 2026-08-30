import { badRequest, ok, serverError } from '../helpers/http.js'
import {
  checkIfAmountIsValid,
  checkIfTypeIsValid,
  invalidAmountResponse,
  invalidTypeResponse,
} from '../helpers/transaction.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation.js'
export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.transactionId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const params = httpRequest.body

      const allowedFields = ['name', 'date', 'amount', 'type']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )
      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some fields are not allowed' })
      }

      if (params.amount) {
        const amountIsValid = checkIfAmountIsValid(params.amount)
        if (!amountIsValid) {
          return invalidAmountResponse()
        }
      }

      if (params.type) {
        const typeIsValid = checkIfTypeIsValid(params.type)
        if (!typeIsValid) {
          return invalidTypeResponse()
        }
      }

      const transaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      )
      return ok(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
