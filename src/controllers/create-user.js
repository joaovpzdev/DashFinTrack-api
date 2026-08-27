import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      //validar a requisicao (campos obrigatorios, email, tamanho da senha)
      
      const requiredFields = ['first_name', 'last_name', 'email', 'password']
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return {
            statusCode: 400,
            body: { error: `Missing required field: ${field}` },
          }
        }
      }

      const passwordIsValid = params.password.length < 6

      if (!passwordIsValid) {
        return {
          statusCode: 400,
          body: { error: 'Password must be at least 6 characters long' },
        }
      }

      const emailIsValid = validator.isEmail(params.email)

      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: { error: 'Invalid email format' },
        }
      }

      //chamar o use case

      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)

      //retornar a resposta para o cliente (status code)

      return {
        statusCode: 201,
        body: createdUser,
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }
    }
  }
}
