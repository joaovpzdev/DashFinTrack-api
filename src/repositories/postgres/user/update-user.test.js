import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import { faker } from '@faker-js/faker'

describe('PostgresUpdateUserRepository', () => {
  it('should update user on db', async () => {
    const user = await prisma.user.create({data: fakeUser})
    const sut = new PostgresUpdateUserRepository()

    const updatedUserParams = {
        id: faker.string.uuid(),
       first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    const result = await sut.execute(user.id, updatedUserParams)

    expect(result).toStrictEqual(expect.objectContaining(updatedUserParams))
  })

  it('should call Prisma with correct params', async () => {
    const user = await prisma.user.create({data: fakeUser})
    const sut = new PostgresUpdateUserRepository()

    const updatedUserParams = {
        id: faker.string.uuid(),
       first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }

    const prismaSpy = jest.spyOn(prisma.user, 'update')

    await sut.execute(user.id, updatedUserParams)

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: updatedUserParams
    })
  })
   it('should throw if Prisma throws', async () => {
          // Arrange
          const sut = new PostgresUpdateUserRepository()
          jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())
  
          const promise = sut.execute(fakeUser.id, {
              id: faker.string.uuid(),
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              email: faker.internet.email(),
              password: faker.internet.password()
          });
  
          // Act & Assert
          await expect(promise).rejects.toThrow()
      })
})