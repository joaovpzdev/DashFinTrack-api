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
