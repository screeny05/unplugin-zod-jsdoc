/**
 * String schema
 * @deprecated
 */
const sDeprecated = z.string();

/**
 * Deprecated schema
 * @deprecated Use `sString` instead
 */
const sDeprecatedWithDescription = z.string();

// --- result ---

/**
 * String schema
 * @deprecated
 */
const sDeprecated = z.string().meta({ description: "String schema", deprecated: true });

/**
 * Deprecated schema
 * @deprecated Use `sString` instead
 */
const sDeprecatedWithDescription = z.string().meta({ description: "Deprecated schema", deprecated: true });