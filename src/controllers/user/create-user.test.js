import { CreateUserController } from './create-user.js'
import { EmailAlreadyExistsError } from '../../errors/user.js'
import { user } from '../../../tests/index.js'

describe('Create User Controller', () => {
  const httpRequest = {
    body: {
      ...user,
      id: undefined,
    },
  }
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  it('should create a new user successfully', async () => {
    // arrange

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)
    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(httpRequest.body)
  })

  it('should return 400 if first_name is not provided', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        last_name: user.last_name,
        email: user.email,
        password: user.password,
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if last_name is not provided', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: user.first_name,
        email: user.email,
        password: user.password,
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not provided', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not valid', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        ...user,
        email: 'invalid-email',
        password: 'securepassword',
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is not provided', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if less than 6 characters in password', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        ...user,
        password: 'iifs',
      },
    }

    //act

    const result = await createUserController.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should call CreateUserUseCase with correct parameters', async () => {
    // arrange
    class CreateUserUseCaseStub {
      execute(user) {
        return user
      }
    }

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        ...user,
        password: 'securepassword',
      },
    }

    const executeSpy = jest.spyOn(createUserUseCase, 'execute')
    //act
    await createUserController.execute(httpRequest)
    //assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

it('should return 500 if CreateUserUseCase throws', async () => {
  // arrange
  class CreateUserUseCaseSecondStub {
    execute() {
      throw new Error()
    }
  }

  const createUserUseCase = new CreateUserUseCaseSecondStub()
  const createUserController = new CreateUserController(createUserUseCase)

  const httpRequest = {
    body: {
      ...user,
      password: 'securepassword',
    },
  }

  //act
  const result = await createUserController.execute(httpRequest)

  //assert
  expect(result.statusCode).toBe(500)
})

it('should return 400 if CreateUserUseCase throws EmailIsAlreadyInUseError', async () => {
  // arrange
  class CreateUserUseCaseThirdStub {
    execute() {
      throw new EmailAlreadyExistsError()
    }
  }

  const createUserUseCase = new CreateUserUseCaseThirdStub()
  const createUserController = new CreateUserController(createUserUseCase)

  const httpRequest = {
    body: {
      ...user,
      password: 'securepassword',
    },
  }

  //act
  const result = await createUserController.execute(httpRequest)

  //assert
  expect(result.statusCode).toBe(400)
})
