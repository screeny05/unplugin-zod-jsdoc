/**
 * String schema
 */
const sString = z.string();

/** Number schema */
const sNumber = z.number();

/**
 * Boolean schema
 */
const sBoolean = z.boolean();

/**
 * Date schema
 */
const sDate = z.date();

/**
 * Bigint schema
 */
const sBigint = z.bigint();

/**
 * Null schema
 */
const sNull = z.null();

// --- result ---

/**
 * String schema
 */
const sString = z.string().meta({ description: "String schema" });

/** Number schema */
const sNumber = z.number().meta({ description: "Number schema" });

/**
 * Boolean schema
 */
const sBoolean = z.boolean().meta({ description: "Boolean schema" });

/**
 * Date schema
 */
const sDate = z.date().meta({ description: "Date schema" });

/**
 * Bigint schema
 */
const sBigint = z.bigint().meta({ description: "Bigint schema" });

/**
 * Null schema
 */
const sNull = z.null().meta({ description: "Null schema" });