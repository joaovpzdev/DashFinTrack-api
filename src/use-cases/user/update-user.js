import { EmailAlreadyExistsError } from '../../errors/user.js'

export class UpdateUserUseCase {
  constructor(PostgresGetUserByEmailRepository, PostgresUpdateUserRepository, passwordHasherAdapter) {
    this.PostgresGetUserByEmailRepository = PostgresGetUserByEmailRepository
    this.PostgresUpdateUserRepository = PostgresUpdateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
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
      const hashedPassword = await this.passwordHasherAdapter.execute(updateUserParams.password)

      user.password = hashedPassword
    }

    const updateUser = await this.PostgresUpdateUserRepository.execute(
      userId,
      user,
    )
    return updateUser
  }
}
