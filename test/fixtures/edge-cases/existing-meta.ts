/**
 * JSDoc meta
 */
const sMeta = z.string().meta({ description: "Zod meta" });

/**
 * JSDoc description
 */
const sDescription = z.string().description("Zod description");

/**
 * Force transform
 */
const sSchema = z.string();

// --- result ---

/**
 * JSDoc meta
 */
const sMeta = z.string().meta({ description: "Zod meta" });

/**
 * JSDoc description
 */
const sDescription = z.string().description("Zod description");

/**
 * Force transform
 */
const sSchema = z.string().meta({ description: "Force transform" });