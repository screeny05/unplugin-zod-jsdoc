import { z } from 'zod/v4';
/**
 * Complete user profile
 */
const userSchema = z.object({
  /** Basic user information */
  profile: z.object({
    /** User's full name */
    name: z.string(),
    /** User's email address */
    email: z.string().email(),
    /** Contact preferences */
    preferences: z.object({
      /** Email notifications enabled */
      emailNotifications: z.boolean(),
      /** SMS notifications enabled */
      smsNotifications: z.boolean()
    })
  }),
  /** User permissions */
  permissions: z.array(z.string())
}); 