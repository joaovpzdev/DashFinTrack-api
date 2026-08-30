import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresCreateTransactionRepository } from '../../repositories/postgres/transaction/create-transaction.js'
import { CreateTransactionUseCase } from '../../use-cases/transaction/create-transaction.js'
import { GetTransactionsByUserIdController } from '../../controllers/transaction/get-transactions-by-user-id.js'
import { GetTransactionsByUserIdUseCase } from '../../use-cases/transaction/get-transactions-by-user-id.js'
import { PostgresGetTransactionsByUserIdRepository } from '../../repositories/postgres/transaction/get-transactions-by-user-id.js'
import { PostgresUpdateTransactionRepository } from '../../repositories/postgres/transaction/update-transaction.js'
import { UpdateTransactionUseCase } from '../../use-cases/transaction/update-transaction.js'
import { UpdateTransactionController } from '../../controllers/transaction/update-transaction.js'

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

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserIdRepository()
  
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
      getTransactionsByUserIdRepository,
      getUserByIdRepository,
    )

    const getTransactionsByUserIdController = new GetTransactionsByUserIdController(
      getTransactionsByUserIdUseCase,
    )


  return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )

  return updateTransactionController
}