import { z } from 'zod/v4';
/**
 * Complete user profile
 */
const userSchema = z.object({
  /** Basic user information */
  profile: z.object({
    /** User's full name */
    name: z.string().meta({ description: `User's full name` }),
    /** User's email address */
    email: z.string().email().meta({ description: `User's email address` }),
    /** Contact preferences */
    preferences: z.object({
      /** Email notifications enabled */
      emailNotifications: z.boolean().meta({ description: `Email notifications enabled` }),
      /** SMS notifications enabled */
      smsNotifications: z.boolean().meta({ description: `SMS notifications enabled` })
    }).meta({ description: `Contact preferences` })
  }).meta({ description: `Basic user information` }),
  /** User permissions */
  permissions: z.array(z.string()).meta({ description: `User permissions` })
}).meta({ description: `Complete user profile` }); 