import { prisma } from "../../../prisma/prisma.js";

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
             await prisma.transaction.delete({
               where: {
                 id: transactionId,
               },
             })

        }catch (error) {
            console.error(error)
           return null
        }

    }
}