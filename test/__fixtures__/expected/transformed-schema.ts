import { z } from 'zod/v4';
const schema = z.object({
  /** Date string that gets parsed */
  date: z.string().transform(val => new Date(val)).meta({ description: `Date string that gets parsed` })
}); 