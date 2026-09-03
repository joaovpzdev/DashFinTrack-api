import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../../tests/index.js'
import { PostgresGetUserByEmailRepository } from './get-user-by-email.js'

describe('PostgresGetUserByEmailRepository', () => {
  it('should get user by email', async () => {
    const user = await prisma.user.create({ data: fakeUser })

    const sut = new PostgresGetUserByEmailRepository()

    const result = await sut.execute(user.email)

    expect(result).toStrictEqual(user)
  })
  it('should call Prisma with correct params', async () => {
    const sut = new PostgresGetUserByEmailRepository()

    const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

    await sut.execute(fakeUser.email)

    expect(prismaSpy).toHaveBeenCalledWith({ where: { email: fakeUser.email } })
  })
  it('should throw if Prisma throws', async () => {
    // Arrange
    const sut = new PostgresGetUserByEmailRepository()
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

    const promise = sut.execute(fakeUser.email)

    // Act & Assert
    await expect(promise).rejects.toThrow()
  })
})
