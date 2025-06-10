import { z } from 'zod/v4';
/**
 * User role enumeration
 */
const roleSchema = z.enum(['admin', 'user', 'guest']).meta({ description: `User role enumeration` }); 