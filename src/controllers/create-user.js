import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError  } from './helpers/http.js'
import { EmailAlreadyExistsError } from '../errors/user.js'
import { checkIfPasswordIsValid, generateInvalidEmailResponse, generateInvalidPasswordResponse, checkIfEmailIsValid } from './helpers/user.js'

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['first_name', 'last_name', 'email', 'password']
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({message: `Missing required field: ${field}`})
        }
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password)

      if (!passwordIsValid) {
        return generateInvalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsValid(params.email)

      if (!emailIsValid) {
        return generateInvalidEmailResponse()
      }

      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)

      return created(createdUser)
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return badRequest({message: error.message})
      }
      console.log(error)
      return serverError({message: 'Internal server error'})
    }
  }
}
