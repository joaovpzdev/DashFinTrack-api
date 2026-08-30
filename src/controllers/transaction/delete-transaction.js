import { serverError, ok } from "../helpers/http.js"
import { checkIfIdIsValid, generateInvalidIdResponse } from "../helpers/validation.js"

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
            const transaction = await this.deleteTransactionUseCase.execute(httpRequest.params.transactionId)
            return ok(transaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}