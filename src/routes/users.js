import { Router } from 'express'
import {
  makeGetUserByIdController,
  makeCreateUserController,
  makeUpdateUserController,
  makeGetUserBalanceController,
  makeDeleteUserController,
} from '../factories/controllers/user.js'
import { makeGetTransactionsByUserIdController } from '../factories/controllers/transaction.js'

export const usersRouter = Router()

usersRouter.get('/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserByIdController()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).json(body)
})

usersRouter.get('/:userId/balance', async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController()

  const { statusCode, body } = await getUserBalanceController.execute(request)

  response.status(statusCode).json(body)
})

usersRouter.post('/', async (request, response) => {
  const createUserController = makeCreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).json(body)
})

usersRouter.patch('/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserController()

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).json(body)
})

usersRouter.delete('/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserController()

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).json(body)
})

usersRouter.get(
  '/:userId/transactions',
  async (request, response) => {
    const getTransactionsByUserIdController =
      makeGetTransactionsByUserIdController()

    const { statusCode, body } =
      await getTransactionsByUserIdController.execute(request)

    response.status(statusCode).json(body)
  },
)
