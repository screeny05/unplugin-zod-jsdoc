import { z } from 'zod/v4';
const schema = z.object({
  /** User creation timestamp */
  createdAt: z.date()
}); 