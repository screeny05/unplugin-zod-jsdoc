/**
 * Discriminated union schema
 */
const sDiscriminatedUnion = z.discriminatedUnion("type", [
  /**
   * Item description 1
   */
  z.object({
    type: z.literal("a"),
    age: z.number(),
  }),
  /**
   * Item description 2
   */
  z.object({
    type: z.literal("b"),
    name: z.string(),
  }),
]);

// --- result ---

/**
 * Discriminated union schema
 */
const sDiscriminatedUnion = z.discriminatedUnion("type", [
  /**
   * Item description 1
   */
  z.object({
    type: z.literal("a"),
    age: z.number(),
  }).meta({ description: "Item description 1" }),
  /**
   * Item description 2
   */
  z.object({
    type: z.literal("b"),
    name: z.string(),
  }).meta({ description: "Item description 2" }),
]).meta({ description: "Discriminated union schema" });