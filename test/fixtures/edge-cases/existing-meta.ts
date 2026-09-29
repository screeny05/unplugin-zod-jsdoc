/**
 * JSDoc meta
 */
const sMeta = z.string().meta({ description: "Zod meta" });

/**
 * JSDoc description
 */
const sDescription = z.string().description("Zod description");

/**
 * JSDoc describe
 * @title JSDoc title
 */
const sDescribe = z.string().describe("Zod describe");

/**
 * JSDoc describe in the middle
 */
const sDescribeMiddle = z.string().describe("Zod describe").optional();

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
 * JSDoc describe
 * @title JSDoc title
 */
const sDescribe = z.string().describe("Zod describe");

/**
 * JSDoc describe in the middle
 */
const sDescribeMiddle = z.string().describe("Zod describe").optional();

/**
 * Force transform
 */
const sSchema = z.string().meta({ description: "Force transform" });