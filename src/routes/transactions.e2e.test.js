import request from 'supertest'
import { app } from '../app.cjs'
import { transaction, user } from '../../tests'

describe('TransactionsRoutes E2E Tests', () => {
  it('POST /api/transactions should return 201 when creating a new transaction', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users/')
      .send({
        ...user,
        id: undefined,
      })
    const response = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        id: undefined,
        user_id: createdUser.id,
      })
    expect(response.status).toBe(201)
    expect(response.body.user_id).toBe(createdUser.id)
    expect(response.body.type).toBe(transaction.type)
    expect(response.body.amount).toBe(String(transaction.amount))
  })

  it('GET /api/transactions?userId should return 200 when fetching transactions successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users/')
      .send({
        ...user,
        id: undefined,
      })
    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        id: undefined,
        user_id: createdUser.id,
      })
    const response = await request(app).get(
      `/api/transactions?userId=${createdUser.id}`,
    )
    expect(response.status).toBe(200)
    expect(response.body[0].id).toBe(createdTransaction.id)
  })

  it('PATCH /api/transactions/:id should return 200 when updating a transaction successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users/')
      .send({
        ...user,
        id: undefined,
      })
    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        id: undefined,
        user_id: createdUser.id,
      })
    const response = await request(app)
      .patch(`/api/transactions/${createdTransaction.id}`)
      .send({ amount: 150 })

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe('150')
  })
  it('DELETE /api/transactions/:id should return 200 when deleting a transaction successfully', async () => {
    const { body: createdUser } = await request(app)
      .post('/api/users/')
      .send({
        ...user,
        id: undefined,
      })
    const { body: createdTransaction } = await request(app)
      .post('/api/transactions')
      .send({
        ...transaction,
        id: undefined,
        user_id: createdUser.id,
      })
    const response = await request(app).delete(
      `/api/transactions/${createdTransaction.id}`,
    )

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(createdTransaction.id)
  })

  it('PATCH /api/transactions/:id should return 400 when updating a non-existent transaction', async () => {
    const response = await request(app)
      .patch(`/api/transactions/non-existent-id`)
      .send({ amount: 150 })

    expect(response.status).toBe(400)
  })

  it('DELETE /api/transactions/:id should return 400 when deleting a non-existent transaction', async () => {
    const response = await request(app).delete(
      `/api/transactions/non-existent-id`,
    )

    expect(response.status).toBe(400)
  })

  it('GET /api/transaction?userId should return 400 when fetching transactions for a non-existent user', async () => {
    const response = await request(app).get(
      `/api/transactions?userId=non-existent-id`,
    )

    expect(response.status).toBe(400)
  })
})
