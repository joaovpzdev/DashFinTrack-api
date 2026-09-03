import { UpdateUserUseCase } from './update-user.js'
import { faker } from '@faker-js/faker'
import { EmailAlreadyExistsError } from '../../errors/user.js'
import { user } from '../../../tests/index.js'

describe('UpdateUserUseCase', () => {
  class PostgresGetUserByEmailRepositoryStub {
    async execute() {
      return null
    }
  }

  class PasswordHashedAdapterStub {
    async execute() {
      return `hashed_password`
    }
  }

  class PostgresUpdateUserRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepositoryStub()
    const passwordHashedAdapter = new PasswordHashedAdapterStub()
    const updateUserRepository = new PostgresUpdateUserRepositoryStub()
    const sut = new UpdateUserUseCase(
      postgresGetUserByEmailRepository,
      updateUserRepository,
      passwordHashedAdapter,
    )

    return {
      sut,
      postgresGetUserByEmailRepository,
      passwordHashedAdapter,
      updateUserRepository,
    }
  }

  it('should update the user successfully (without email and password)', async () => {
    const { sut } = makeSut()
    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    })
    expect(result).toBe(user)
  })

  it('should update the user successfully (with email)', async () => {
    const { sut, postgresGetUserByEmailRepository } = makeSut()
    const postgresGetUserByEmailRepositorySpy = jest.spyOn(
      postgresGetUserByEmailRepository,
      'execute',
    )

    const email = faker.internet.email()

    const result = await sut.execute(faker.string.uuid(), {
      email,
    })

    expect(postgresGetUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
    expect(result).toBe(user)
  })

  it('should update the user successfully (with password)', async () => {
    const { sut, passwordHashedAdapter } = makeSut()
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHashedAdapter,
      'execute',
    )

    const password = faker.internet.password()
    const result = await sut.execute(faker.string.uuid(), {
      password,
    })

    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
    expect(result).toBe(user)
  })

  it('should throw EmailAlreadyExistsError if the email is already in use', async () => {
    const { sut, postgresGetUserByEmailRepository } = makeSut()
    jest
      .spyOn(postgresGetUserByEmailRepository, 'execute')
      .mockResolvedValueOnce(user)

    const promise = sut.execute(faker.string.uuid(), {
      email: user.email,
    })

    await expect(promise).rejects.toThrow(
      new EmailAlreadyExistsError(user.email),
    )
  })

  it('should call PostgresUpdateUserRepository with the correct values', async () => {
    const { sut, updateUserRepository } = makeSut()
    const updateUserRepositorySpy = jest.spyOn(updateUserRepository, 'execute')

    await sut.execute(user.id, {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
    })

    expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: 'hashed_password',
    })
  })

  it('should throw if PostgresGetUserByEmailRepository throws', async () => {
    const { sut, postgresGetUserByEmailRepository } = makeSut()
    jest
      .spyOn(postgresGetUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    const promise = sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    })

    await expect(promise).rejects.toThrow()
  })

  it('should throw if PasswordHasherAdapter throws', async () => {
    const { sut, passwordHashedAdapter } = makeSut()
    jest
      .spyOn(passwordHashedAdapter, 'execute')
      .mockRejectedValueOnce(new Error())

    const promise = sut.execute(faker.string.uuid(), {
      password: faker.internet.password(),
    })

    await expect(promise).rejects.toThrow()
  })

  it('should throw if PostgresUpdateUserRepository throws', async () => {
    const { sut, updateUserRepository } = makeSut()
    jest
      .spyOn(updateUserRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    const promise = sut.execute(faker.string.uuid(), {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
    })

    await expect(promise).rejects.toThrow()
  })
})
