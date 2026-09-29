const sObject = z.object({
  /** Doc one */
  // a line comment
  a: z.string(),

  /** Doc two */
  // eslint-disable-next-line some-rule
  // another line comment
  b: z.string(),
});

/** Exported */
// marker
export const sExported = z.string();

/** Not attached: code in between */
const sNumber = 1; // trailing
const sAfterCode = z.string();

/** Not attached: block comment in between */
/* block */
const sAfterBlock = z.string();

// --- result ---

const sObject = z.object({
  /** Doc one */
  // a line comment
  a: z.string().meta({ description: "Doc one" }),

  /** Doc two */
  // eslint-disable-next-line some-rule
  // another line comment
  b: z.string().meta({ description: "Doc two" }),
});

/** Exported */
// marker
export const sExported = z.string().meta({ description: "Exported" });

/** Not attached: code in between */
const sNumber = 1; // trailing
const sAfterCode = z.string();

/** Not attached: block comment in between */
/* block */
const sAfterBlock = z.string();
