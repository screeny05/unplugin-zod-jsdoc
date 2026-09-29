/** Non-literal argument */
const sIdentifier = z.string().meta(shared);

/** Call argument */
const sCall = z.string().meta(makeMeta());

/** Meta in the middle */
const sMiddle = z.string().meta({ a: 1 }).optional();

/** Several meta calls */
const sSeveral = z.string().meta({ a: 1 }).meta({ b: 2 });

/** Describe, then meta */
const sDescribeThenMeta = z.string().describe("x").meta({ b: 2 });

/** Meta getter */
const sGetter = z.string().meta();

/** Two arguments */
const sTwoArgs = z.string().meta({ a: 1 }, extra);

/**
 * Referenced schema
 * @id Derived
 */
const sReferenced = Money.meta({ cms: 1 });

/** Referenced schema, chained */
const sReferencedChain = Money.optional().meta({ cms: 1 });

/** Not a zod API */
const sDescription = z.string().description("x");

// --- result ---
