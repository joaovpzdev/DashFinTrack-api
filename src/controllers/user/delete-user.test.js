import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'
import { user } from '../../../tests/index.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('DeleteUserController', () => {
  class DeleteUserUseCaseStub {
    async execute() {
      return user
    }
  }
  const makeSut = () => {
    const deleteUserUseCase = new DeleteUserUseCaseStub()
    const sut = new DeleteUserController(deleteUserUseCase)
    return { deleteUserUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 if user is successfully deleted', async () => {
    //
    const { sut } = makeSut()

    //act
    const result = await sut.execute(httpRequest)

    //assert
    expect(result.statusCode).toBe(200)
  })

  it('should return 400 if id is invalid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({ params: { userId: 'invalid-id' } })

    expect(result.statusCode).toBe(400)
  })

  it('should return 404 if user is not found', async () => {
    const { sut, deleteUserUseCase } = makeSut()
    const userId = faker.string.uuid()

    // mock the execute method to throw the domain error and trigger 404 mapping
    jest
      .spyOn(deleteUserUseCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError(userId))

    const result = await sut.execute({ params: { userId } })

    expect(result.statusCode).toBe(404)
  })

  it('should return 500 if DeleteUserUseCase throws', async () => {
    const { sut, deleteUserUseCase } = makeSut()

    jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(new Error())

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  it('should call DeleteUserUseCase with correct params', async () => {
    const { sut, deleteUserUseCase } = makeSut()

    const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

    await sut.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })
})
