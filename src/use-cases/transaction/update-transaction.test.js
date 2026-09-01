import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'

describe('UpdateTransactionUseCase', () => {


    const transaction = {
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7,
            }),
          }

    class PostgresUpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transaction
            }
        }
    }
    const makeSut = () => {
        const updateTransactionRepository = new PostgresUpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)
        
        return {
            sut,
            updateTransactionRepository
        }
    }

    it('should update transaction successfully', async () => {
        const { sut } = makeSut()
        const transactionId = faker.string.uuid()

        const result = await sut.execute(transactionId)

        expect(result).toEqual({
            id: transactionId,
            ...transaction
        })
    })

    it('should call PostgresUpdateTransactionRepository with correct transactionId', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(updateTransactionRepository, 'execute')

       
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transaction.id, {
            amount: transaction.amount,
        })
    })

    it('should throw if PostgresUpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(updateTransactionRepository, 'execute').mockRejectedValueOnce(new Error())

        await expect(sut.execute(transaction.id, {
            amount: transaction.amount,
        })).rejects.toThrow()
    })
})