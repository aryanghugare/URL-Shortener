import {z} from 'zod';

// Validation schema for the signup POST request body
export const signupPostRequestBodySchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(3),
});