import { UpdateTransactionController } from './update-transaction.js'
import { faker } from '@faker-js/faker'

describe('UpdateTransactionController', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      }
    }
  }
  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCase)

    return { sut, updateTransactionUseCase }
  }

  const baseHttpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  }

  it('should return 200 when updating a transaction is successful', async () => {
    const { sut } = makeSut()

    const response = await sut.execute(baseHttpRequest)

    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when the transaction ID is invalid', async () => {
    const { sut } = makeSut()

    const invalidHttpRequest = {
      ...baseHttpRequest,
      params: {
        transactionId: 'invalid-uuid',
      },
    }

    const response = await sut.execute(invalidHttpRequest)

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when unallowed fields are provided', async () => {
    const { sut } = makeSut()

    const invalidHttpRequest = {
      ...baseHttpRequest,
      body: {
        ...baseHttpRequest.body,
        unallowed_field: 'some value',
      },
    }

    const response = await sut.execute(invalidHttpRequest)

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when the amount is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        ...baseHttpRequest.body,
        amount: 'invalid_amount',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when the type is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        ...baseHttpRequest.body,
        type: 'INVALID_TYPE',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 500 when updateTransactionUseCase throws', async () => {
    const { sut, updateTransactionUseCase } = makeSut()

    jest
      .spyOn(updateTransactionUseCase, 'execute')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const response = await sut.execute(baseHttpRequest)

    expect(response.statusCode).toBe(500)
  })

  it('should call UpdateTransactionUseCase with correct params', async () => {
    const { sut, updateTransactionUseCase } = makeSut()

    const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

    await sut.execute(baseHttpRequest)

    expect(executeSpy).toHaveBeenCalledWith(
      baseHttpRequest.params.transactionId,
      baseHttpRequest.body,
    )
  })
})
