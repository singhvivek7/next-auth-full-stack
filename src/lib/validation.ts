import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please provide proper email address'),
  password: z.string().min(8, 'Password must contain at least 8 character'),
});

export const signUpSchema = z.object({
  name: z.string().min(4, 'Name must contain at least 4 character'),
  email: z.string().email('Please provide proper email address'),
  password: z.string().min(8, 'Password must contain at least 8 character'),
});
