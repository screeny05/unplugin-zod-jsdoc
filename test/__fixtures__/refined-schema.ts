import { z } from 'zod/v4';
const schema = z.object({
  /** Password with custom validation */
  password: z.string().min(8).refine(val => /[A-Z]/.test(val), 'Must contain uppercase')
}); 