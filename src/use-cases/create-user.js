import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams){
        //gerar ID 
        const userID = uuidv4();
        //criptografar senha
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)
        //inserir usuario no postgres
        const user = {
            first_name: createUserParams.first_name,
            last_name: createUserParams.last_name,
            email: createUserParams.email,
            id: userID,
            password: hashedPassword
        }
        //chamar o repositório do Postgres para criar o usuário
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createdUser = await postgresCreateUserRepository.execute(user)
        return createdUser
    }
}