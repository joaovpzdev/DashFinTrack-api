import { PostgresDeleteUserRepository } from './delete-user'
import { user } from '../../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('PostgresDeleteUserRepository', () => {
  it('should delete a user from the db', async () => {
    //
    await prisma.user.create({ data: user })
    const sut = new PostgresDeleteUserRepository()

    // Act
    const result = await sut.execute(user.id)

    // Assert
    expect(result).toStrictEqual(user)
  })

  it('should call Prisma with correct parameters', async () => {
    // Arrange
    await prisma.user.create({ data: user })
    const sut = new PostgresDeleteUserRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'delete')

    // Act
    await sut.execute(user.id)

    // Assert
    expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } })
  })

})
