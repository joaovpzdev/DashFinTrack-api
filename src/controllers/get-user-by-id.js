import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import {  ok, serverError } from './helpers/http.js'
import { checkIfIdIsValid, generateInvalidIdResponse, userNotFoundResponse } from './helpers/user.js' 


export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      
        const isValid = checkIfIdIsValid(httpRequest.params.userId)

        if(!isValid) {
            return generateInvalidIdResponse()
        }
        
        const getUserByIdUseCase = new GetUserByIdUseCase()

        const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

        if (!user) {
            return userNotFoundResponse()
        }
        

      return ok(user)
    } catch (error) {
        console.log(error)
      return serverError()
    }
  }
}