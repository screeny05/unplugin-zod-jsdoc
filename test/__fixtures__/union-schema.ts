import { z } from 'zod/v4';
/**
 * Status can be pending, approved, or rejected
 */
const statusSchema = z.union([
  z.literal('pending'),
  z.literal('approved'), 
  z.literal('rejected')
]); 