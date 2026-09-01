import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
      earnings: faker.finance.amount(),
      expenses: faker.finance.amount(),
      investments: faker.finance.amount(),
      balance: faker.finance.amount(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }

    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        })
        }
    }
}


    const makeSut = () => {
        const postgresGetUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const postgresGetUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(postgresGetUserBalanceRepository, postgresGetUserByIdRepository)

        return {
            sut,
            postgresGetUserBalanceRepository,
            postgresGetUserByIdRepository,
        }
    }



    it('should get the user balance', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(userBalance)
       
    })

    it('should throw UserNotFoundError if PostgresGetUserByIdRepository returns null', async () => {
        const { sut, postgresGetUserByIdRepository } = makeSut()
        jest.spyOn(postgresGetUserByIdRepository, 'execute').mockResolvedValueOnce(null)
        const userId = faker.string.uuid()

        await expect(sut.execute(userId)).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call PostgresGetUserBalanceRepository with the correct userId', async () => {
        const { sut, postgresGetUserBalanceRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(postgresGetUserBalanceRepository, 'execute')

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call PostgresGetUserByIdRepository with the correct userId', async () => {
      const { sut, postgresGetUserByIdRepository } = makeSut()
      const userId = faker.string.uuid()
      const executeSpy = jest.spyOn(postgresGetUserByIdRepository, 'execute')

      await sut.execute(userId)

      expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if PostgresGetUserBalanceRepository throws', async () => {
        const { sut, postgresGetUserBalanceRepository } = makeSut()
        jest.spyOn(postgresGetUserBalanceRepository, 'execute').mockRejectedValueOnce(new Error())

        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow()
    })

     it('should throw if PostgresGetUserByIdRepository throws', async () => {
       const { sut, postgresGetUserByIdRepository } = makeSut()
       jest
         .spyOn(postgresGetUserByIdRepository, 'execute')
         .mockRejectedValueOnce(new Error())

       const promise = sut.execute(faker.string.uuid())

       await expect(promise).rejects.toThrow()
     })
})