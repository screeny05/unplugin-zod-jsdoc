/**
 * @id OrderStatus
 * @title OrderStatus
 */
export const OrderStatus = wellKnownString(ORDER_STATUSES).meta({ cms: 1 });

const sObject = z.object({
  /** What happened. */
  action: wellKnownString(ACTIONS).optional().meta({ cms: { localized: false } }),
  /**
   * What kind of fee this is.
   */
  kind: wellKnownString(KINDS)
    .optional()
    .meta({ cms: { localized: false } }),
  /** JSDoc description */
  explicit: wellKnownString(KINDS).meta({ description: "Explicit" }),
  /**
   * JSDoc description
   * @title JSDoc title
   */
  described: wellKnownString(KINDS).describe("Explicit"),
  /** Mid-chain meta is skipped */
  middle: wellKnownString(KINDS).meta({ cms: 1 }).optional(),
  /** Cast, then merged */
  cast: (wellKnownString(KINDS) as z.ZodType<Kind>).optional().meta({ cms: 1 }),
  /** Bare, appended */
  bare: wellKnownString(KINDS),
});

// --- result ---

/**
 * @id OrderStatus
 * @title OrderStatus
 */
export const OrderStatus = wellKnownString(ORDER_STATUSES).meta({ title: "OrderStatus", id: "OrderStatus", cms: 1 });

const sObject = z.object({
  /** What happened. */
  action: wellKnownString(ACTIONS).optional().meta({ description: "What happened.", cms: { localized: false } }),
  /**
   * What kind of fee this is.
   */
  kind: wellKnownString(KINDS)
    .optional()
    .meta({ description: "What kind of fee this is.", cms: { localized: false } }),
  /** JSDoc description */
  explicit: wellKnownString(KINDS).meta({ description: "Explicit" }),
  /**
   * JSDoc description
   * @title JSDoc title
   */
  described: wellKnownString(KINDS).describe("Explicit").meta({ title: "JSDoc title" }),
  /** Mid-chain meta is skipped */
  middle: wellKnownString(KINDS).meta({ cms: 1 }).optional(),
  /** Cast, then merged */
  cast: (wellKnownString(KINDS) as z.ZodType<Kind>).optional().meta({ description: "Cast, then merged", cms: 1 }),
  /** Bare, appended */
  bare: wellKnownString(KINDS).meta({ description: "Bare, appended" }),
});
