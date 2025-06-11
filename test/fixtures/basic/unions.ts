/**
 * Union schema
 */
const sUnion = z.union([
  /**
   * Item description 1
   */
  z.string(),
  /**
   * Item description 2
   */
  z.number(),
]);

// --- result ---

/**
 * Union schema
 */
const sUnion = z.union([
  /**
   * Item description 1
   */
  z.string().meta({ description: "Item description 1" }),
  /**
   * Item description 2
   */
  z.number().meta({ description: "Item description 2" }),
]).meta({ description: "Union schema" });