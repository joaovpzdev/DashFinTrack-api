import {
  makeCreateTransactionController,
  makeUpdateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionsByUserIdController,
} from './transaction.js'
import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'
import { DeleteTransactionController } from '../../controllers/transaction/delete-transaction.js'
import { GetTransactionsByUserIdController } from '../../controllers/transaction/get-transactions-by-user-id.js'

describe('TransactionControllerFactories', () => {
  it('should return a valid CreateTransactionController instance', () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    )
  })
  it('should return a valid UpdateTransactionController instance', () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    )
  })
  it('should return a valid DeleteTransactionController instance', () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    )
  })
  it('should return a valid GetTransactionsByUserIdController instance', () => {
    expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
      GetTransactionsByUserIdController,
    )
  })
})
