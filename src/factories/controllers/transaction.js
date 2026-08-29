import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { PostgresGetUserByIdRepository } from '../../repositories/user/postgres-get-user-by-id-repository.js'
import { PostgresCreateTransactionRepository } from '../../repositories/transaction/postgres-create-transaction-repository.js'
import { CreateTransactionUseCase } from '../../use-cases/transaction/create-transaction-use-case.js'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()

  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )

  return createTransactionController
}
