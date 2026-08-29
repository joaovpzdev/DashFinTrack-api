import 'dotenv/config.js'
import express from 'express'
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js'
import { CreateUserUseCase } from './src/use-cases/create-user.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'
import { PostgresUpdateUserRepository } from './src/repositories/postgres/update-user.js'
import { PostgresDeleteUserRepository } from './src/repositories/postgres/delete-user.js'
import { DeleteUserUseCase } from './src/use-cases/delete-user.js'

import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'
import { UpdateUserController } from './src/controllers/update-user.js'
import { UpdateUserUseCase } from './src/use-cases/update-user.js'
import { DeleteUserController } from './src/controllers/delete-user.js'

const app = express()

app.use(express.json())

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).json(body)
})

app.post('/api/users', async (request, response) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

  const createUserRepository = new PostgresCreateUserRepository()

  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const updateUserRepository = new PostgresUpdateUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  )

  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
