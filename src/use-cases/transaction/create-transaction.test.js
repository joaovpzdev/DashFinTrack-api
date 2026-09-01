import { CreateTransactionUseCase } from './create-transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../../tests/index.js'

describe('CreateTransactionUseCase', () => {
  const createTransactionParams = {
    ...transaction,
    id: undefined,
  }

  class PostgresCreateTransactionRepositoryStub {
    async execute() {
      return transaction
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'random_id'
    }
  }

  class PostgresGetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const postgresCreateTransactionRepository =
      new PostgresCreateTransactionRepositoryStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()
    const postgresGetUserByIdRepository =
      new PostgresGetUserByIdRepositoryStub()

    const sut = new CreateTransactionUseCase(
      postgresCreateTransactionRepository,
      postgresGetUserByIdRepository,
      idGeneratorAdapter,
    )

    return {
      sut,
      postgresCreateTransactionRepository,
      idGeneratorAdapter,
      postgresGetUserByIdRepository,
    }
  }

  it('should create a transaction successfully', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const result = await sut.execute(createTransactionParams)
    // Assert
    expect(result).toEqual(transaction)
  })

  it('should call PostgresGetUserByIdRepository with the correct params', async () => {
    // Arrange
    const { sut, postgresGetUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(postgresGetUserByIdRepository, 'execute')

    // Act
    await sut.execute(createTransactionParams)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id)
  })

  it('should call IdGeneratorAdapter', async () => {
    // Arrange
    const { sut, idGeneratorAdapter } = makeSut()
    const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

    // Act
    await sut.execute(createTransactionParams)

    // Assert
    expect(executeSpy).toHaveBeenCalled()
  })

  it('should call PostgresCreateUserRepository with the correct params', async () => {
    // Arrange
    const { sut, postgresCreateTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(
      postgresCreateTransactionRepository,
      'execute',
    )

    // Act
    await sut.execute(createTransactionParams)

    // Assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'random_id',
    })
  })

  it('should throw UserNotFoundError if the user does not exist', async () => {
    // Arrange
    const { sut, postgresGetUserByIdRepository } = makeSut()
    jest
      .spyOn(postgresGetUserByIdRepository, 'execute')
      .mockResolvedValueOnce(null)

    const promise = sut.execute(createTransactionParams)
    // Act & Assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    )
  })

  it('should throw if PostgresGetUserByIdRepository throws', async () => {
    // Arrange
    const { sut, postgresGetUserByIdRepository } = makeSut()
    jest
      .spyOn(postgresGetUserByIdRepository, 'execute')
      .mockRejectedValue(new Error())

    const promise = sut.execute(createTransactionParams)
    // Act & Assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if IdGeneratorAdapter throws', async () => {
    // Arrange
    const { sut, idGeneratorAdapter } = makeSut()
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementation(() => {
      throw new Error()
    })

    const promise = sut.execute(createTransactionParams)
    // Act & Assert
    await expect(promise).rejects.toThrow()
  })

  it('should throw if PostgresCreateTransactionRepository throws', async () => {
    // Arrange
    const { sut, postgresCreateTransactionRepository } = makeSut()
    jest
      .spyOn(postgresCreateTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    const promise = sut.execute(createTransactionParams)
    // Act & Assert
    await expect(promise).rejects.toThrow()
  })
})
