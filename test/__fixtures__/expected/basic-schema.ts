import { z } from 'zod/v4';
/**
 * This is a comment
 */
const foo = z.object({ name: z.string() }).meta({ description: `This is a comment` }); 