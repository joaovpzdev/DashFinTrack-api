import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { user } from '../../../tests/index.js'

describe('GetTransactionsByUserIdUseCase', () => {

    class PostgresGetTransactionsByUserIdRepositoryStub {
        async execute(){
            return []
        }
    }
    class PostgresGetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository = new PostgresGetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new PostgresGetUserByIdRepositoryStub()
        const  sut = new GetTransactionsByUserIdUseCase(getTransactionsByUserIdRepository, getUserByIdRepository)
        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        }
    }
    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()
        const userId = faker.string.uuid()

        const result = await sut.execute(userId)

        expect(result).toEqual([])
    })
    
    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const id = faker.string.uuid()

        const promise = sut.execute(id)

        await expect(promise).rejects.toThrow(new UserNotFoundError(id))
    })

    it('should call GetUserByIdRepository with the correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const id = faker.string.uuid()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(id)

        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should call GetTransactionsByUserIdRepository with the correct params', async () => {
      const { sut, getTransactionsByUserIdRepository } = makeSut()
      const id = faker.string.uuid()
      const executeSpy = jest.spyOn(getTransactionsByUserIdRepository, 'execute')

      await sut.execute(id)

      expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should throw an error if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const id = faker.string.uuid()
        jest.spyOn(getTransactionsByUserIdRepository, 'execute').mockRejectedValueOnce(new Error())

        const promise = sut.execute(id)

        await expect(promise).rejects.toThrow(new Error())
    })

     it('should throw an error if GetUserByIdRepository throws', async () => {
       const { sut, getUserByIdRepository } = makeSut()
       const id = faker.string.uuid()
       jest
         .spyOn(getUserByIdRepository, 'execute')
         .mockRejectedValueOnce(new Error())

       const promise = sut.execute(id)

       await expect(promise).rejects.toThrow(new Error())
     })


})