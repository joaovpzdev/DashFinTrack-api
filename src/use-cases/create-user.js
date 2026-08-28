import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyExistsError } from '../errors/user.js'

export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepository()

    const userWithProvidedEmail =
      await postgresGetUserByEmailRepository.execute(createUserParams.email)

    if (userWithProvidedEmail) {
      throw new EmailAlreadyExistsError(createUserParams.email)
    }

    //gerar ID
    const userId = uuidv4()
    //criptografar senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
    //inserir usuario no postgres
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }
    //chamar o repositório do Postgres para criar o usuário
    const postgresCreateUserRepository = new PostgresCreateUserRepository()
    const createdUser = await postgresCreateUserRepository.execute(user)
    return createdUser
  }
}
