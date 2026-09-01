import { PostgresCreateUserRepository } from './create-user';
import { user } from '../../../../tests/index.js';
import { prisma } from '../../../../prisma/prisma.js';

describe('PostgresCreateUserRepository', () => {



    it('should create a new user on db', async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository();

        // Act
        const result = await sut.execute(user)

        // Assert
        expect(result.id).toBe(user.id);
        expect(result.first_name).toBe(user.first_name);
        expect(result.last_name).toBe(user.last_name);
        expect(result.email).toBe(user.email);
        expect(result.password).toBe(user.password);
    });

    it('should call Prisma with correct parameters', async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = jest.spyOn(prisma.user, 'create');

        // Act
        await sut.execute(user);
        

        expect(prismaSpy).toHaveBeenCalledWith({ data: user });
    });

    it('should throw if Prisma throws', async () => {
        // Arrange
        const sut = new PostgresCreateUserRepository()
        jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user);

        // Act & Assert
        await expect(promise).rejects.toThrow()
    })
      
});