import validator from 'validator'
import { badRequest, notFound } from '../helpers/http.js'

export const checkIfAmountIsValid = (amount) => {
  if (typeof amount !== 'number') {
    return false
  }

  return validator.isCurrency(
    amount.toFixed(2),
    {
      digits_after_decimal: [2],
      allow_negatives: false,
      decimal_separator: '.',
    }
  )
}

export const checkIfTypeIsValid = (type) => 
  ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmountResponse = () => 
    badRequest({
      message: 'Invalid amount format',
    })

export const invalidTypeResponse = () => 
    badRequest({
      message: 'Invalid type',
    })

export const transactionNotFoundResponse = () => 
    notFound({
      message: 'Transaction not found',
    })