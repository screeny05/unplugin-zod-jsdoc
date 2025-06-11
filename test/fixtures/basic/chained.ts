/**
 * Optional schema
 */
const sOptional = z.string().optional();

/**
 * Nullable schema
 */
const sNullable = z.string().nullable();

/**
 * Default schema
 */
const sDefault = z.string().default("foo");

/**
 * Complex schema
 */
const sComplex = z.string().startsWith("foo").optional().default("foo-bar").trim().length(10);

// --- result ---

/**
 * Optional schema
 */
const sOptional = z.string().optional().meta({ description: "Optional schema" });

/**
 * Nullable schema
 */
const sNullable = z.string().nullable().meta({ description: "Nullable schema" });

/**
 * Default schema
 */
const sDefault = z.string().default("foo").meta({ description: "Default schema" });

/**
 * Complex schema
 */
const sComplex = z.string().startsWith("foo").optional().default("foo-bar").trim().length(10).meta({ description: "Complex schema" });