import { z } from 'zod/v4';
/**
 * A user schema with validation rules
 * This schema defines the structure for user data
 */
const userSchema = z.object({ id: z.string() }).meta({ description: `A user schema with validation rules This schema defines the structure for user data` }); 