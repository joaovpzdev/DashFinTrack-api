import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7
                })
            }
        }
    }
    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { getUserByIdUseCase, sut }
    }
    
    it('should return 200 if an user is found', async () => {
        const { sut } = makeSut()

        
        const result = await sut.execute({params:{
        userId: faker.string.uuid(),
      }})

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is not valid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({params:{
        userId: 'invalid-uuid',
      }})

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null)

        const result = await sut.execute({params:{
        userId: faker.string.uuid(),
      }})

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(new Error())

        const result = await sut.execute({params:{
        userId: faker.string.uuid(),
      }})

        expect(result.statusCode).toBe(500)
    })

})