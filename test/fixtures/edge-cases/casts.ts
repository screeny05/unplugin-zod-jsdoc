const sObject = z.object({
  /** Cast, then chained */
  a: (z.string() as z.ZodType<Foo>).optional(),
  /** Trailing cast */
  b: z.string() as z.ZodType<Foo>,
  /** Double cast */
  c: z.string() as unknown as Foo,
  /** Satisfies */
  d: z.string() satisfies z.ZodType<string>,
  /** Parenthesized */
  e: (z.string()),
  /** Non-null assertion */
  f: z.string()!,
  /** Type assertion */
  g: <z.ZodType<Foo>>z.string(),
});

/** Object cast */
export const sTyped = z.object({
  /** Name */
  name: z.string(),
}) as z.ZodType<Named>;

// --- result ---

const sObject = z.object({
  /** Cast, then chained */
  a: (z.string() as z.ZodType<Foo>).optional().meta({ description: "Cast, then chained" }),
  /** Trailing cast */
  b: z.string().meta({ description: "Trailing cast" }) as z.ZodType<Foo>,
  /** Double cast */
  c: z.string().meta({ description: "Double cast" }) as unknown as Foo,
  /** Satisfies */
  d: z.string().meta({ description: "Satisfies" }) satisfies z.ZodType<string>,
  /** Parenthesized */
  e: (z.string().meta({ description: "Parenthesized" })),
  /** Non-null assertion */
  f: z.string().meta({ description: "Non-null assertion" })!,
  /** Type assertion */
  g: <z.ZodType<Foo>>z.string().meta({ description: "Type assertion" }),
});

/** Object cast */
export const sTyped = z.object({
  /** Name */
  name: z.string().meta({ description: "Name" }),
}).meta({ description: "Object cast" }) as z.ZodType<Named>;
