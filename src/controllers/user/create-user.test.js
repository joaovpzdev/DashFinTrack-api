import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  it('should create a new user successfully', async () => {
    // arrange

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: 'Joao',
        last_name: 'Zolim',
        email: 'joao.zolim@example.com',
        password: 'securepassword',
      },
    }

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
      first_name: '',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
      password: 'securepassword',
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
      first_name: 'Joao',
      email: 'joao.zolim@example.com',
      password: 'securepassword',
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
      first_name: 'Joao',
      last_name: 'Zolim',
      password: 'securepassword',
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
      first_name: 'Joao',
      last_name: 'Zolim',
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
      first_name: 'Joao',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
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
      first_name: 'Joao',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
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
      first_name: 'Joao',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
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