import { updateTransactionSchema } from '../../../schemas/transaction.js'
import { badRequest, ok, serverError } from '../helpers/http.js'
import { ZodError } from 'zod'
import { TransactionNotFoundError } from '../../errors/transaction.js'
import { transactionNotFoundResponse } from '../helpers/transaction.js'
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

      await updateTransactionSchema.parseAsync(params)

      const transaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      )
      return ok(transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      if (error instanceof TransactionNotFoundError) {
        return transactionNotFoundResponse()
      }
      console.error(error)
      return serverError()
    }
  }
}
