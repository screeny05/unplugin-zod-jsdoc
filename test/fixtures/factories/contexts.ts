/**
 * @id OrderStatus
 * @title OrderStatus
 */
export const OrderStatus = wellKnownString(ORDER_STATUSES);

/** Declared */
const sConst = wellKnownString(["a", "b"]);

const sObject = z.object({
  /** Property */
  prop: wellKnownString(ACTIONS),
  /** Chained */
  chained: wellKnownString(ACTIONS).optional(),
  /** Multi-line chain */
  multiLine: wellKnownString(ACTIONS)
    .optional()
    .nullable(),
  /** Type arguments */
  typed: wellKnownString<Action>(ACTIONS),
  /** Cast */
  cast: wellKnownString(ACTIONS) as z.ZodType<Action>,
  /** Cast, then chained */
  castChained: (wellKnownString(ACTIONS) as z.ZodType<Action>).optional(),
  /** Existing meta is left alone */
  existing: wellKnownString(ACTIONS).optional().meta({ cms: 1 }),
  /** Existing describe is left alone */
  described: wellKnownString(ACTIONS).describe("Explicit"),
  /** Not a listed factory */
  other: otherFactory(ACTIONS),
  /** Member callee, plain entry */
  member: lib.wellKnownString(ACTIONS),
  /** Factory as a value, not a call */
  reference: wellKnownString,
});

const sArray = z.array(
  /** Call argument */
  wellKnownString(ACTIONS)
);

const sUnion = z.union([
  /** Array element */
  wellKnownString(ACTIONS),
  z.number(),
]);

// --- result ---

/**
 * @id OrderStatus
 * @title OrderStatus
 */
export const OrderStatus = wellKnownString(ORDER_STATUSES).meta({ description: "", title: "OrderStatus", id: "OrderStatus" });

/** Declared */
const sConst = wellKnownString(["a", "b"]).meta({ description: "Declared" });

const sObject = z.object({
  /** Property */
  prop: wellKnownString(ACTIONS).meta({ description: "Property" }),
  /** Chained */
  chained: wellKnownString(ACTIONS).optional().meta({ description: "Chained" }),
  /** Multi-line chain */
  multiLine: wellKnownString(ACTIONS)
    .optional()
    .nullable().meta({ description: "Multi-line chain" }),
  /** Type arguments */
  typed: wellKnownString<Action>(ACTIONS).meta({ description: "Type arguments" }),
  /** Cast */
  cast: wellKnownString(ACTIONS).meta({ description: "Cast" }) as z.ZodType<Action>,
  /** Cast, then chained */
  castChained: (wellKnownString(ACTIONS) as z.ZodType<Action>).optional().meta({ description: "Cast, then chained" }),
  /** Existing meta is left alone */
  existing: wellKnownString(ACTIONS).optional().meta({ cms: 1 }),
  /** Existing describe is left alone */
  described: wellKnownString(ACTIONS).describe("Explicit"),
  /** Not a listed factory */
  other: otherFactory(ACTIONS),
  /** Member callee, plain entry */
  member: lib.wellKnownString(ACTIONS),
  /** Factory as a value, not a call */
  reference: wellKnownString,
});

const sArray = z.array(
  /** Call argument */
  wellKnownString(ACTIONS).meta({ description: "Call argument" })
);

const sUnion = z.union([
  /** Array element */
  wellKnownString(ACTIONS).meta({ description: "Array element" }),
  z.number(),
]);
