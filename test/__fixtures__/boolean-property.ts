import { z } from 'zod/v4';
const schema = z.object({
  /** Whether user is active */
  isActive: z.boolean().default(true)
}); 