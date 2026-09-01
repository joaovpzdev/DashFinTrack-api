import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'
import { user } from '../../../tests/index.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user

        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { getUserByIdUseCase, sut }
    }

    const baseHttpRequest = {
        params: {
            userId: faker.string.uuid()
        }
    }
    
    it('should return 200 if an user is found', async () => {
        const { sut } = makeSut()

        
        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid-uuid'
            }
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null)

        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(new Error())

        const result = await sut.execute(baseHttpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(expect.any(String))
    })

})