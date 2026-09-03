export class GetUserByIdUseCase {
  constructor(gerUserByIdRepository) {
    this.getUserByIdRepository = gerUserByIdRepository
  }
  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId)
    return user
  }
}
