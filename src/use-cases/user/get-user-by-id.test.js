import { GetUserByIdUseCase } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'
import { user } from '../../../tests/index.js'

describe('GetUserByIdUseCase', () => {
  class PostgresGetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const postgresGetUserByIdRepository =
      new PostgresGetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(postgresGetUserByIdRepository)

    return {
      sut,
      postgresGetUserByIdRepository,
    }
  }

  it('should get the user by id successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(faker.string.uuid())

    expect(result).toEqual(user)
  })

  it('should call PostgresGetUserByIdRepository with correct params', async () => {
    const { sut, postgresGetUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(postgresGetUserByIdRepository, 'execute')
    const userId = faker.string.uuid()

    await sut.execute(userId)

    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should throw if PostgresGetUserByIdRepository throws', async () => {
    const { sut, postgresGetUserByIdRepository } = makeSut()
    jest
      .spyOn(postgresGetUserByIdRepository, 'execute')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.execute(faker.string.uuid())

    await expect(promise).rejects.toThrow()
  })
})
