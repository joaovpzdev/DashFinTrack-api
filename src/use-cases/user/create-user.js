import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyExistsError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(createUserRepository, getUserByEmailRepository, passwordHasherAdapter) {
    this.createUserRepository = createUserRepository
    this.getUserByEmailRepository = getUserByEmailRepository
    this.passwordHasherAdapter = passwordHasherAdapter
  }
  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyExistsError(createUserParams.email)
    }

    //gerar ID
    const userId = uuidv4()
    //criptografar senha
    const hashedPassword = await this.passwordHasherAdapter.execute(createUserParams.password)
    //inserir usuario no postgres
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    //chamar o repositório do Postgres para criar o usuário
    const createdUser = await this.createUserRepository.execute(user)
    return createdUser
  }
}
