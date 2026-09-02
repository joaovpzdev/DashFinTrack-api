import {
  makeGetUserByIdController,
  makeCreateUserController,
  makeUpdateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
} from './user.js'
import { GetUserByIdController } from '../../controllers/user/get-user-by-id.js'
import { GetUserBalanceController } from '../../controllers/user/get-user-balance.js'
import { CreateUserController } from '../../controllers/user/create-user.js'
import { UpdateUserController } from '../../controllers/user/update-user.js'
import { DeleteUserController } from '../../controllers/user/delete-user.js'

describe('UserControllerFactories', () => {
  it('should return a valid GetUserByIdController instance', () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController)
  })
  it('should return a valid CreateUserController instance', () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
  })
  it('should return a valid UpdateUserController instance', () => {
    expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
  })
  it('should return a valid DeleteUserController instance', () => {
    expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
  })
   it('should return a valid GetUserBalanceController instance', () => {
     expect(makeGetUserBalanceController()).toBeInstanceOf(GetUserBalanceController)
   })
})
