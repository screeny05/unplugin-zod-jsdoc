import { z } from 'zod/v4';
const schema = z.object({
  /** User age in years */
  age: z.number().min(0).max(120).meta({ description: `User age in years` })
}); 