import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

describe('DeleteUserUseCase', () => {

    const user =  {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
    }

  class DeleteUserRepositoryStub {
    async execute() {
      return user
      }
    }
  
  const makeSut = () => {
    const postgresDeleteUserRepository = new DeleteUserRepositoryStub()
    const sut = new DeleteUserUseCase(postgresDeleteUserRepository)

    return {
      sut,
      postgresDeleteUserRepository,
    }
  }

  it('should delete a user', async () => {
    const { sut } = makeSut()
    const deletedUser = await sut.execute(faker.string.uuid())

    expect(deletedUser).toEqual(user)
  })

  it('should call DeleteUserRepository with correct params', async () => {
    const { sut, postgresDeleteUserRepository } = makeSut()
    const executeSpy = jest.spyOn(postgresDeleteUserRepository, 'execute')
    const userId = faker.string.uuid()

    await sut.execute(userId)

    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  it('should throw if DeleteUserRepository throws', async () => {
    const { sut, postgresDeleteUserRepository } = makeSut()
    jest.spyOn(postgresDeleteUserRepository, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.execute(faker.string.uuid())

    await expect(promise).rejects.toThrow()
  })
})
