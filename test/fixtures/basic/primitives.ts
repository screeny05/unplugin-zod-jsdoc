/**
 * const schema
 */
const sConst = z.string();

/**
 * let schema
 */
let sLet = z.string();

/**
 * var schema
 */
var sVar = z.string();

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
 * const schema
 */
const sConst = z.string().meta({ description: "const schema" });

/**
 * let schema
 */
let sLet = z.string().meta({ description: "let schema" });

/**
 * var schema
 */
var sVar = z.string().meta({ description: "var schema" });

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