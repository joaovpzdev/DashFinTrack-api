import { serverError, ok } from "../helpers/http.js"
import { checkIfIdIsValid, generateInvalidIdResponse } from "../helpers/validation.js"
import { transactionNotFoundResponse } from "../helpers/transaction.js"

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)
            if (!idIsValid) {
                return generateInvalidIdResponse()
            }
            const deletedTransaction = await this.deleteTransactionUseCase.execute(httpRequest.params.transactionId)
            if (!deletedTransaction) {
                return transactionNotFoundResponse()
            }


            return ok(deletedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}