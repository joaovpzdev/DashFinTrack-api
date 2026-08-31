import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionUseCase {
    constructor(createTransactionRepository, getUserByIdRepository, idGeneratorAdapter) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGeneratorAdapter = idGeneratorAdapter
    }
    async execute(createTransactionParams) {
        const user_id = createTransactionParams.user_id
        const user = await this.getUserByIdRepository.execute(user_id)

        if (!user) {
            throw new UserNotFoundError(user_id)
        }

        const transactionId = this.idGeneratorAdapter.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...createTransactionParams,
            id: transactionId,
        })
        return transaction
    }


}