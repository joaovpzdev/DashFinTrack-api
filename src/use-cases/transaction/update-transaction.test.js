import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { transaction } from '../../../tests/index.js'


describe('UpdateTransactionUseCase', () => {


    class PostgresUpdateTransactionRepositoryStub {
        async execute() {
            return transaction
            
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