import { createTransactionSchema } from '../../../schemas/transaction.js'
import { serverError, created, badRequest } from '../helpers/http.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      await createTransactionSchema.parseAsync(params)
      const transaction = await this.createTransactionUseCase.execute(params)

      return created(transaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }
      console.log(error)
      return serverError()
    }
  }
}
