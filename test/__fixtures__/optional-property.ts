import { z } from 'zod/v4';
const schema = z.object({
  /** Optional user bio */
  bio: z.string().optional()
}); 