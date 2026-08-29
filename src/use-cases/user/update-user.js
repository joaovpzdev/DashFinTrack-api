import bcrypt from 'bcrypt'
import { EmailAlreadyExistsError } from '../../errors/user.js'

export class UpdateUserUseCase {
  constructor(PostgresGetUserByEmailRepository, PostgresUpdateUserRepository) {
    this.PostgresGetUserByEmailRepository = PostgresGetUserByEmailRepository
    this.PostgresUpdateUserRepository = PostgresUpdateUserRepository
  }
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userWithProvidedEmail =
        await this.PostgresGetUserByEmailRepository.execute(
          updateUserParams.email,
        )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyExistsError(updateUserParams.email)
      }
    }

    const user = {
      ...updateUserParams,
    }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)

      user.password = hashedPassword
    }

    const updateUser = await this.PostgresUpdateUserRepository.execute(
      userId,
      user,
    )
    return updateUser
  }
}
