import { z } from 'zod/v4';

/**
 * This is a comment
 */
const foo = z.object({ 
  name: z.string(),
  age: z.number()
});

const bar = z.object({
  /** Also a comment */
  title: z.string(),
  /** Another nested comment */
  count: z.number().optional()
});

/**
 * A user schema with validation rules
 * This schema defines the structure for user data
 */
const userSchema = z.object({
  /** The user's unique identifier */
  id: z.string().uuid(),
  
  /** The user's email address */
  email: z.string().email(),
  
  /** User's profile information */
  profile: z.object({
    /** Full name of the user */
    name: z.string().min(1),
    
    /** User's age (optional) */
    age: z.number().min(0).max(120).optional()
  })
});

// This should not be transformed (no JSDoc)
const simpleSchema = z.string();

/**
 * Complex schema with chained methods
 */
const complexSchema = z.array(z.string()).min(1).max(10); 