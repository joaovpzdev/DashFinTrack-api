import { notFound } from '../helpers/http.js'

export const transactionNotFoundResponse = () =>
  notFound({
    message: 'Transaction not found',
  })
