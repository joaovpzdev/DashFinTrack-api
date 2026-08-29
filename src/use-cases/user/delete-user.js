export class DeleteUserUseCase {
  constructor(PostgresDeleteUserRepository) {
    this.PostgresDeleteUserRepository = PostgresDeleteUserRepository
  }

  async execute(userId) {
    const deletedUser = await this.PostgresDeleteUserRepository.execute(userId)
    return deletedUser
  }
}
