import { UserNotFoundError } from '../../errors/user.js'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { faker } from '@faker-js/faker'
import { transaction } from '../../../tests/index.js'

describe('GetTransactionsByUserIdController', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return transaction
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub()
    const sut = new GetTransactionsByUserIdController(getUserByIdUseCase)

    return { sut, getUserByIdUseCase }
  }

  it('should return 200 when transactions are successfully retrieved', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    })

    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when missing userId param', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      query: { userId: undefined },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when userId param is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      query: {
        userId: 'invalid-user-id',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
    const { sut, getUserByIdUseCase } = makeSut()
    jest
      .spyOn(getUserByIdUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError())

    const response = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 500 when GetUserByIdUseCase throws an unexpected error', async () => {
    const { sut, getUserByIdUseCase } = makeSut()
    jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(new Error())

    const response = await sut.execute({
      query: {
        userId: faker.string.uuid(),
      },
    })

    expect(response.statusCode).toBe(500)
  })

  it('should call GetUserByIdUseCase with correct params', async () => {
    const { sut, getUserByIdUseCase } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

    const userId = faker.string.uuid()
    await sut.execute({
      query: {
        userId: userId,
      },
    })

    expect(executeSpy).toHaveBeenCalledWith(userId)
  })
})
