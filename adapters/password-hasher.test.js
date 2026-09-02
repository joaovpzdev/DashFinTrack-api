import { PasswordHasherAdapter } from './password-hasher.js'
import { faker } from '@faker-js/faker'

describe('PasswordHasherAdapter', () => {
  it('should hash a password', async () => {
    const sut = new PasswordHasherAdapter()

    const password = faker.internet.password()
    const hashedPassword = await sut.execute(password)

    expect(hashedPassword).toBeTruthy()
    expect(typeof hashedPassword).toBe('string')
    expect(hashedPassword).not.toBe(password)
  })
})