import { badRequest, serverError, created } from '../helpers/http.js'
import { checkIfAmountIsValid, checkIfTypeIsValid, invalidAmountResponse, invalidTypeResponse } from '../helpers/transaction.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
} from '../helpers/validation.js'


export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

       const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

       const { ok: someRequiredfieldWasProvided, missingField } = validateRequiredFields(params, requiredFields)

       if (!someRequiredfieldWasProvided) {
         return requiredFieldIsMissingResponse(missingField)
       }

     

      for (const field of requiredFields) {
        if (!params[field] || params[field].toString()?.trim().length === 0) {
          return badRequest({
            message: `Missing param: ${field}`,
          })
        }
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)
      if (!userIdIsValid) {
        return generateInvalidIdResponse()
      }

      const amountIsValid = checkIfAmountIsValid(params.amount)

      if (!amountIsValid) {
        return invalidAmountResponse()
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = checkIfTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
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
