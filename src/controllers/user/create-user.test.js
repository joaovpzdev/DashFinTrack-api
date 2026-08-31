import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'

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
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
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
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
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
      first_name: faker.person.firstName(),
      email: faker.internet.email(),
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
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
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
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
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
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
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
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
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
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
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