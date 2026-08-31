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

    const httpsRequest = {
      body: {
        first_name: 'Joao',
        last_name: 'Zolim',
        email: 'joao.zolim@example.com',
        password: 'securepassword',
      },
    }

    //act

    const result = await createUserController.execute(httpsRequest)

    //assert
    expect(result.statusCode).toBe(201)
    expect(result.body).not.toBeNull()
    expect(result.body).not.toBeUndefined()
  })
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

  const httpsRequest = {
    body: {
      first_name: '',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
      password: 'securepassword',
    },
  }

  //act

  const result = await createUserController.execute(httpsRequest)

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

  const httpsRequest = {
    body: {
      first_name: 'Joao',
      last_name: '',
      email: 'joao.zolim@example.com',
      password: 'securepassword',
    },
  }

  //act

  const result = await createUserController.execute(httpsRequest)

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

  const httpsRequest = {
    body: {
      first_name: 'Joao',
      last_name: 'Zolim',
      email: '',
      password: 'securepassword',
    },
  }

  //act

  const result = await createUserController.execute(httpsRequest)

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

  const httpsRequest = {
    body: {
      first_name: 'Joao',
      last_name: 'Zolim',
      email: 'joao.zolim@example.com',
      password: '',
    },
  }

  //act

  const result = await createUserController.execute(httpsRequest)

  //assert
  expect(result.statusCode).toBe(400)
})