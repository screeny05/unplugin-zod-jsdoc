import { z } from 'zod/v4';
/**
 * User schema. Also, this should be ${escaped}.
 * @description This validates user data
 * @example { name: "John" }
 */
const userSchema = z.object({ name: z.string() }).meta({ description: `User schema. Also, this should be \${escaped}. @description This validates user data @example { name: "John" }` });
