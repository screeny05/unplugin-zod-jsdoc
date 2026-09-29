const sObject = z.object({
  /** Dotted entry */
  a: lib.wellKnownString(ACTIONS).optional(),
  /** Deeper dotted entry */
  b: api.common.factory(ACTIONS),
  /** A plain call does not match a dotted entry */
  c: wellKnownString(ACTIONS),
  /** A computed member is not matched */
  d: lib["wellKnownString"](ACTIONS),
  /** A different object is not matched */
  e: other.wellKnownString(ACTIONS),
});

// --- result ---

const sObject = z.object({
  /** Dotted entry */
  a: lib.wellKnownString(ACTIONS).optional().meta({ description: "Dotted entry" }),
  /** Deeper dotted entry */
  b: api.common.factory(ACTIONS).meta({ description: "Deeper dotted entry" }),
  /** A plain call does not match a dotted entry */
  c: wellKnownString(ACTIONS),
  /** A computed member is not matched */
  d: lib["wellKnownString"](ACTIONS),
  /** A different object is not matched */
  e: other.wellKnownString(ACTIONS),
});
