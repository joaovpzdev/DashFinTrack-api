import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
describe('DeleteTransactionUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  }

  class PostgresDeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId
      }
    }
  }

  const makeSut = () => {
    const postgresDeleteTransactionRepository = new PostgresDeleteTransactionRepositoryStub()

    const sut = new DeleteTransactionUseCase(postgresDeleteTransactionRepository)

    return {
      sut,
      postgresDeleteTransactionRepository,
    }
  }

  it('should delete a transaction successfully', async () => {
    const { sut } = makeSut()

  
    const result = await sut.execute(transaction.id)

    expect(result).toEqual({
      ...transaction,
      id: transaction.id,
    })
  })

  it('should call PostgresDeleteTransactionRepository with the correct transaction ID', async () => {
    const { sut, postgresDeleteTransactionRepository } = makeSut()
    const postgresDeleteTransactionRepositorySpy = jest.spyOn(postgresDeleteTransactionRepository, 'execute')

    const id = faker.string.uuid()

    await sut.execute(id)

    expect(postgresDeleteTransactionRepositorySpy).toHaveBeenCalledWith(id)
  })

  it('should throw if PostgresDeleteTransactionRepository throws', async () => {
    const { sut, postgresDeleteTransactionRepository } = makeSut()
    jest.spyOn(postgresDeleteTransactionRepository, 'execute').mockRejectedValueOnce(new Error('Repository error'))
    const id = faker.string.uuid()
    
    const promise = sut.execute(id) 
    
    expect(promise).rejects.toThrow()
  })
  

})
