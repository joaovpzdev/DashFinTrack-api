import { badRequest, serverError, created } from '../helpers/http.js'
import { checkIfIdIsValid, generateInvalidIdResponse } from '../helpers/user.js'
import validator from 'validator'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = [
        'id',
        'user_id',
        'name',
        'date',
        'amount',
        'description',
      ]

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({
            message: `Missing param: ${field}`,
          })
        }
      }

      const userIdIsValid = checkIfIdIsValid(params['user_id'])
      if (!userIdIsValid) {
        return generateInvalidIdResponse()
      }

      if (params.amount <= 0) {
        return badRequest({
          message: 'Amount must be greater than zero',
        })
      }

      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })

      if (!amountIsValid) {
        return badRequest({
          message: 'Invalid amount format',
        })
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typeIsValid) {
        return badRequest({
          message: 'Invalid type',
        })
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
