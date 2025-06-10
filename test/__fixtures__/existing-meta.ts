import { z } from 'zod/v4';
const schema = z.object({
  /** This JSDoc should be ignored */
  existing: z.string().meta({ description: "Original description", version: "1.0" }),
  
  /** This JSDoc should be applied */
  newField: z.string()
}); 