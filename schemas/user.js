import { z } from 'zod'

export const createUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, { message: 'First name must be at least 1 character long' }),
  last_name: z
    .string()
    .trim()
    .min(1, { message: 'Last name must be at least 1 character long' }),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email must be at least 1 character long' }),
  password: z
    .string()
    .trim()
    .min(6, { message: 'Password must be at least 6 characters long' }),
})