import { z } from 'zod/v4';
const items = z.object({
  /** Array of user objects */
  users: z.array(z.object({ name: z.string() }))
}); 