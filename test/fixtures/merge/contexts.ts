/** Const */
const sConst = z.string().meta({ a: 1 });

/** Exported */
export const sExported = z.string().meta({ a: 1 });

const sObject = z.object({
  /** Property */
  prop: z.string().meta({ a: 1 }),
});

const sUnion = z.union([
  /** Array element */
  z.string().meta({ a: 1 }),
  z.number(),
]);

const sArray = z.array(
  /** Call argument */
  z.string().meta({ a: 1 })
);

// --- result ---

/** Const */
const sConst = z.string().meta({ description: "Const", a: 1 });

/** Exported */
export const sExported = z.string().meta({ description: "Exported", a: 1 });

const sObject = z.object({
  /** Property */
  prop: z.string().meta({ description: "Property", a: 1 }),
});

const sUnion = z.union([
  /** Array element */
  z.string().meta({ description: "Array element", a: 1 }),
  z.number(),
]);

const sArray = z.array(
  /** Call argument */
  z.string().meta({ description: "Call argument", a: 1 })
);
