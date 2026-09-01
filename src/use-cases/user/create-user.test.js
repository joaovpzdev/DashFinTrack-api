import { CreateUserUseCase } from './create-user'
import { EmailAlreadyExistsError } from '../../errors/user.js'
import { user as fixtureUser } from '../../../tests/index.js'

describe('CreateUserUseCase', () => {
  
    const user = {
        ...fixtureUser,
        id: undefined
    }

  const makeSut = () => {
    class GetUserByEmailRepositoryStub {
      async execute() {
        return null
      }
    }

    class CreateUserRepositoryStub {
      async execute(user) {
        return user
      }
    }

    class PasswordHasherStub {
      async execute() {
        return 'hashed_password'
      }
    }

    class IdGeneratorAdapterStub {
      async generate() {
        return 'generated_id'
      }
    }

    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    )

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    }
  }

  it('should create a new user', async () => {
    const { sut } = makeSut()

    const createdUser = await sut.execute(user)

    expect(createdUser).toBeTruthy()
  })

  it('should throw an EmailAlredyExistsError if GetUserByEmailRepository returns a user', async () => {
    const { sut, getUserByEmailRepository } = makeSut()

    jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(user)

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow(
      new EmailAlreadyExistsError(user.email),
    )
  })

  it('should call IdGeneratorAdapter to generate a random id',async  () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
    const isGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'generate')
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')
  

    await sut.execute(user)

    expect(isGeneratorSpy).toHaveBeenCalled()
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      id: 'generated_id',
      password: 'hashed_password',
    })
  })

  it('should call PasswordHasherAdapter to hash the password', async () => {
    const {
      sut,
      createUserRepository,
      passwordHasherAdapter,
    } = makeSut()
  
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapter,
      'execute',
    )

    await sut.execute(user)

    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(user.password)
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      id: 'generated_id',
      password: 'hashed_password',
    })
  })

  it('should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepository } = makeSut()

    jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
      new Error()
    )

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if idGeneratorAdapter throws', async () => {
    const { sut, idGeneratorAdapter } = makeSut()

    jest.spyOn(idGeneratorAdapter, 'generate').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if PasswordHasherAdapter throws', async () => {
    const { sut, passwordHasherAdapter } = makeSut()

    jest.spyOn(passwordHasherAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut()

    jest.spyOn(createUserRepository, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.execute(user)

    await expect(promise).rejects.toThrow()
  })
})