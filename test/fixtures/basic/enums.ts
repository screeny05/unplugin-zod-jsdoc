/**
 * Enum schema
 */
const schema = z.enum(["foo", "bar"]);

// --- result ---

/**
 * Enum schema
 */
const schema = z.enum(["foo", "bar"]).meta({ description: "Enum schema" });