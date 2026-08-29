import validator from 'validator'
import { badRequest } from '../helpers/http.js'

export const checkIfAmountIsValid = (amount) => 
   validator.isCurrency(
    amount.toString(),
    {
      digits_after_decimal: [2],
      allow_negatives: false,
      decimal_separator: '.',
    }
  )


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