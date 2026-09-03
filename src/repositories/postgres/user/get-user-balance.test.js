import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { user as fakeUser } from '../../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionType } from '@prisma/client'
import { faker } from '@faker-js/faker'
describe('PostgresGetUserBalanceRepository', () => {
  it('should get the user balance from the db', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 8000,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 9000,
          type: TransactionType.EARNING,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 4000,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 2000,
          type: TransactionType.EXPENSE,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 3000,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          date: faker.date.recent(),
          amount: 1500,
          type: TransactionType.INVESTMENT,
          user_id: user.id,
        },
      ],
    })

    const sut = new PostgresGetUserBalanceRepository()
    // Act
    const result = await sut.execute(user.id)
    // Assert
    expect(result.earnings.toString()).toBe('17000')
    expect(result.expenses.toString()).toBe('6000')
    expect(result.investments.toString()).toBe('4500')
    expect(result.balance.toString()).toBe('6500')
  })

  it('should call Prisma with correct parameters', async () => {
    // Arrange
    const sut = new PostgresGetUserBalanceRepository()
    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

    // Act
    await sut.execute(fakeUser.id)

    // Assert
    expect(prismaSpy).toHaveBeenCalledTimes(3)
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    })
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    })
  })

  it('should throw if Prisma throws', async () => {
    // Arrange
    const sut = new PostgresGetUserBalanceRepository()
    jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error())

    const promise = sut.execute(fakeUser.id)

    // Act & Assert
    await expect(promise).rejects.toThrow()
  })
})
