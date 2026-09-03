import { CreateTransactionController } from './create-transaction.js'
import { transaction } from '../../../tests/index.js'

describe('CreateTransactionController', () => {
  const makeSut = () => {
    class CreateTransactionUseCaseStub {
      async execute() {
        return transaction
      }
    }
    const createTransactionUseCase = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCase)
    return { sut, createTransactionUseCase }
  }

  const baseHttpRequest = {
    body: {
      ...transaction,
      id: undefined,
    },
  }

  it('should return 201 when a transaction is successfully created (expense)', async () => {
    const { sut } = makeSut()

    const response = await sut.execute(baseHttpRequest)

    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when a transaction is successfully created (earnings)', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'EARNING',
      },
    })

    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when a transaction is successfully created (investment)', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'INVESTMENT',
      },
    })

    expect(response.statusCode).toBe(201)
  })

  it('should return 400 when missing user_id', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        user_id: undefined,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing name', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        name: undefined,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing date', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: undefined,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing type', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: undefined,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing amount', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: undefined,
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when date is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: 'invalid-date',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when type is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'INVALID_TYPE',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when amount is not a valid currency', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: 'INVALID_AMOUNT',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 500 when CreateTransactionUseCase throws', async () => {
    const { sut, createTransactionUseCase } = makeSut()
    jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error())

    const response = await sut.execute(baseHttpRequest)

    expect(response.statusCode).toBe(500)
  })

  it('should call CreateTransactionUseCase with correct params', async () => {
    const { sut, createTransactionUseCase } = makeSut()

    const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

    await sut.execute(baseHttpRequest)

    expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
  })
})
