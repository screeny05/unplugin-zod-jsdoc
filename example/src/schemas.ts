import { z } from "zod/v4";

/**
 * User authentication schema
 * Validates user login credentials
 */
export const loginSchema = z.object({
  /** User's email address for authentication */
  email: z.string().email().meta({}).min(1),

  /** Password must be at least 8 characters */
  password: z.string().min(8),
});

/**
 * Product information schema
 * Defines the structure for product data in our catalog
 */
export const productSchema = z.object({
  /** Unique product identifier */
  id: z.string().uuid(),

  /** Product name (required) */
  name: z.string().min(1),

  /** Product description (optional) */
  description: z.string().optional(),

  /** Product price in cents */
  price: z.number().positive(),

  /** Product categories */
  categories: z.array(z.string()),

  /** Product metadata */
  metadata: z.object({
    /** When the product was created */
    createdAt: z.date(),

    /** Last update timestamp */
    updatedAt: z.date(),

    /** Product visibility status */
    isVisible: z.boolean().default(true),
  }),
});

/**
 * API response wrapper
 * Standard response format for all API endpoints
 */
export const apiResponseSchema = z.object({
  /** Indicates if the request was successful */
  success: z.boolean(),

  /** Response data payload */
  data: z.unknown().optional(),

  /** Error information if request failed */
  error: z
    .object({
      /** Error code */
      code: z.string(),

      /** Human-readable error message */
      message: z.string(),
    })
    .optional(),
});

// This schema has no JSDoc comment, so it won't be transformed
export const simpleSchema = z.string().min(1);

/**
 * User role enumeration
 * Defines the possible roles in the system
 */
export const userRoleSchema = z.enum(["admin", "moderator", "user", "guest"]);

/**
 * Event tracking schema
 * Union type for different kinds of user events
 */
export const eventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("click"),
    /** X coordinate of click */
    x: z.number(),
    /** Y coordinate of click */
    y: z.number(),
    /** Element that was clicked */
    target: z.string(),
  }),
  z.object({
    type: z.literal("scroll"),
    /** Scroll position from top */
    scrollY: z.number(),
    /** Page height at time of scroll */
    pageHeight: z.number(),
  }),
  z.object({
    type: z.literal("keypress"),
    /** The key that was pressed */
    key: z.string(),
    /** Whether modifier keys were held */
    modifiers: z.object({
      /** Ctrl key held */
      ctrl: z.boolean(),
      /** Shift key held */
      shift: z.boolean(),
      /** Alt key held */
      alt: z.boolean(),
    }),
  }),
]);

/**
 * Configuration settings
 * Key-value mapping for application settings
 */
export const settingsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

/**
 * Coordinate pair
 * Represents a point in 2D space
 */
export const coordinateSchema = z.tuple([
  /** X coordinate */
  z.number(),
  /** Y coordinate */
  z.number(),
]);

/**
 * User profile with complex validation
 */
export const userProfileSchema = z.object({
  /** User's display name */
  displayName: z.string().min(1).max(100),

  /** User's avatar URL (nullable) */
  avatar: z.string().url().nullable(),

  /** User's bio (optional) */
  bio: z.string().max(500).optional(),

  /** Account creation date */
  createdAt: z.date(),

  /** User preferences */
  preferences: z.object({
    /** Theme preference */
    theme: z.enum(["light", "dark", "auto"]),

    /** Language preference */
    language: z.string().length(2),

    /** Notification settings */
    notifications: z.object({
      /** Email notifications enabled */
      email: z.boolean().default(true),

      /** Push notifications enabled */
      push: z.boolean().default(false),

      /** SMS notifications enabled */
      sms: z.boolean().default(false),
    }),
  }),

  /** User's social media links */
  socialLinks: z
    .array(
      z.object({
        /** Platform name */
        platform: z.enum(["twitter", "github", "linkedin", "website"]),

        /** Profile URL */
        url: z.string().url(),
      })
    )
    .max(5),

  /** Account verification status */
  verified: z.boolean().default(false),
});

/**
 * Search filters with refined validation
 */
export const searchFiltersSchema = z.object({
  /** Search query string */
  query: z
    .string()
    .min(1)
    .refine((val) => val.trim().length > 0, "Query cannot be only whitespace"),

  /** Results per page (1-100) */
  limit: z.number().min(1).max(100).default(20),

  /** Page offset for pagination */
  offset: z.number().min(0).default(0),

  /** Sort direction */
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  /** Date range filter */
  dateRange: z
    .object({
      /** Start date (ISO string) */
      from: z.string().datetime(),

      /** End date (ISO string) */
      to: z.string().datetime(),
    })
    .optional()
    .refine(
      (data) => !data || new Date(data.from) <= new Date(data.to),
      "Start date must be before end date"
    ),
});
