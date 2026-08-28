import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

import { EmailAlreadyInUse } from '../errors/email-already-in-use.js'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository()

            const userWithProvidedEmail = await postgresGetUserByEmailRepository.execute(updateUserParams.email,)

            if (userWithProvidedEmail) {
                throw new EmailAlreadyInUse('Email is already in use')
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(updateUserParams.password,10)

            user.password = hashedPassword
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()

        const updateUser = await postgresUpdateUserRepository.execute(userId, user)
        return updateUser
    }
}