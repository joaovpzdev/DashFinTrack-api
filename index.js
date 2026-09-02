import 'dotenv/config.js'
import express from 'express'
import { usersRouter } from './src/routes/users.js'
import {
  makeCreateTransactionController,
} from './src/factories/controllers/transaction.js'
import {
  makeUpdateTransactionController,
  makeDeleteTransactionController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.post('/api/transactions', async (request, response) => {
  const createTransactionController = makeCreateTransactionController()

  const { statusCode, body } =
    await createTransactionController.execute(request)

  response.status(statusCode).json(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController()

  const { statusCode, body } =
    await updateTransactionController.execute(request)

  response.status(statusCode).json(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController()

  const { statusCode, body } =
    await deleteTransactionController.execute(request)

  response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
