/**
 * Tuple schema with 2 items
 */
const sTuple = z.tuple([
  /**
   * Item description 1
   */
  z.string(),
  /**
   * Item description 2
   */
  z.number(),
]);

/**
 * Tuple with rest
 */
const sTupleRest = z.tuple([
  /**
   * Item description 1
   */
  z.string(),
  /**
   * Item description 2
   */
  z.number(),
],
  /**
   * Rest item description
   */
  z.string()
);

// --- result ---

/**
 * Tuple schema with 2 items
 */
const sTuple = z.tuple([
  /**
   * Item description 1
   */
  z.string().meta({ description: "Item description 1" }),
  /**
   * Item description 2
   */
  z.number().meta({ description: "Item description 2" }),
]).meta({ description: "Tuple schema with 2 items" });

/**
 * Tuple with rest
 */
const sTupleRest = z.tuple([
  /**
   * Item description 1
   */
  z.string().meta({ description: "Item description 1" }),
  /**
   * Item description 2
   */
  z.number().meta({ description: "Item description 2" }),
],
  /**
   * Rest item description
   */
  z.string().meta({ description: "Rest item description" })
).meta({ description: "Tuple with rest" });