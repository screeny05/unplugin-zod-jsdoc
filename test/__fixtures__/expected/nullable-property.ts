import { z } from 'zod/v4';
const schema = z.object({
  /** Nullable avatar URL */
  avatar: z.string().url().nullable().meta({ description: `Nullable avatar URL` })
}); 