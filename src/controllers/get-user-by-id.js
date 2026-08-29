import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import {  ok, serverError, userNotFound } from './helpers/http.js'
import { generateInvalidIdResponse } from './helpers/user.js' 
import validator from 'validator'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      
        const isValid = validator.isUUID(httpRequest.params.userId)

        if(!isValid) {
            return generateInvalidIdResponse()
        }
        
        const getUserByIdUseCase = new GetUserByIdUseCase()

        const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

        if (!user) {
            return userNotFound({ message: 'User not found' })
        }
        

      return ok(user)
    } catch (error) {
        console.log(error)
      return serverError()
    }
  }
}