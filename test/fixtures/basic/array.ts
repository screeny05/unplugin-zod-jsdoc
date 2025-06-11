/**
 * Array schema
 */
const sArray = z.array(
  /**
   * Item description
   */
  z.string()
).min(1);

// --- result ---

/**
 * Array schema
 */
const sArray = z.array(
  /**
   * Item description
   */
  z.string().meta({ description: "Item description" })
).min(1).meta({ description: "Array schema" });