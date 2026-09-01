import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../../tests/index.js'

describe('DeleteTransactionUseCase', () => {


  class PostgresDeleteTransactionRepositoryStub {
    async execute() {
      return transaction
    
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

    expect(result).toEqual(transaction)
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
