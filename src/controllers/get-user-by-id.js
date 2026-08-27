import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, ok, serverError } from './helper.js'
import validator from 'validator'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      
        const isValid = validator.isUUID(httpRequest.params.userId)

        if(!isValid) {
            return badRequest({ message: 'Invalid request' })
        }
        
        const getUserByIdUseCase = new GetUserByIdUseCase()

        const user = await getUserByIdUseCase.execute(httpRequest.params.userId)
        

      return ok(user)
    } catch (error) {
        console.log(error)
      return serverError()
    }
  }
}