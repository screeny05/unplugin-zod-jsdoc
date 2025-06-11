/**
 * Object schema
 */
const sObject = z.object({
  /**
   * Property description
   */
  name: z.string(),
});

/**
 * Object schema with multiple properties and nested objects
 */
const sObjectMultiple = z.object({
  /**
   * Property description 1
   */
  name: z.string(),

  /**
   * Property description 2
   */
  age: z.object({
    /**
     * Property description nested
     */
    name: z.string(),
  }),
});

// --- result ---

/**
 * Object schema
 */
const sObject = z.object({
  /**
   * Property description
   */
  name: z.string().meta({ description: "Property description" }),
}).meta({ description: "Object schema" });

/**
 * Object schema with multiple properties and nested objects
 */
const sObjectMultiple = z.object({
  /**
   * Property description 1
   */
  name: z.string().meta({ description: "Property description 1" }),

  /**
   * Property description 2
   */
  age: z.object({
    /**
     * Property description nested
     */
    name: z.string().meta({ description: "Property description nested" }),
  }).meta({ description: "Property description 2" }),
}).meta({ description: "Object schema with multiple properties and nested objects" });