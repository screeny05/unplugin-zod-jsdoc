import { z } from 'zod/v4';
/**
 * Array of user IDs
 */
const userIds = z.array(z.string()); 