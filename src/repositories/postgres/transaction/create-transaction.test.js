import { PostgresCreateTransactionRepository } from './create-transaction.js'
import { transaction } from '../../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user } from '../../../../tests/index.js'
import dayjs from 'dayjs'

describe('PostgresCreateTransactionRepository', () => {

    it('should create a transaction on db', async () => {
        // Arrange
         await prisma.user.create({data: user})
        const sut = new PostgresCreateTransactionRepository()

        // Act
        const result = await sut.execute({...transaction, user_id: user.id})

        // Assert
        expect(result.name).toBe(transaction.name)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(result.user_id).toBe(user.id)
        expect(result.type).toBe(transaction.type)
        expect(dayjs(result.date).daysInMonth()).toBe(dayjs(transaction.date).daysInMonth())
        expect(dayjs(result.date).month()).toBe(
          dayjs(transaction.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })
    it('should call Prisma with correct params', async () => {
        await prisma.user.create({data: user})
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        await sut.execute({...transaction, user_id: user.id})

        expect(prismaSpy).toHaveBeenCalledWith({
            data: {...transaction, user_id: user.id}
        })
    })
    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateTransactionRepository()
        jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(new Error())

        const promise = sut.execute({...transaction, user_id: user.id})

        await expect(promise).rejects.toThrow()
    })

})