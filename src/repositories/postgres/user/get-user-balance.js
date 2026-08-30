import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const {_sum: {amount: totalExpenses}} = await prisma.expense.aggregate({
      where: {
        user_id: userId,
        type: 'EXPENSE'
      },
      _sum: {
        amount: true,
      },
    })
    const {_sum: {amount: totalEarnings}} = await prisma.expense.aggregate({
      where: {
        user_id: userId,
        type: 'EARNING',
      },
      _sum: {
        amount: true,
      },
    })
    const {_sum: {amount: totalInvestments}} = await prisma.expense.aggregate({
      where: {
        user_id: userId,
        type: 'INVESTMENT',
      },
      _sum: {
        amount: true,
      },
    })
    const balance = totalEarnings - totalExpenses - totalInvestments
    return balance
  }
}
