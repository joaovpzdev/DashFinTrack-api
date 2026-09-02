import { PostgresDeleteUserRepository } from './delete-user'
import { user } from '../../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

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

  it('should throw generic error if Prisma throws a generic error', async () => {
      const sut = new PostgresDeleteUserRepository()
      jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())
  
      const promise = sut.execute(user.id)
  
      await expect(promise).rejects.toThrow()
    })
    
    it('should throw UserNotFoundError if Prisma throws P2025 error', async () => {
      const sut = new PostgresDeleteUserRepository()
      jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new PrismaClientKnownRequestError('', {
        code: 'P2025',
      })) 
  
      const promise = sut.execute(user.id)
  
      await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
    })

})
