/**
 * Phone number
 * @title Phone
 * @id PhoneNumber
 * @example +49157
 */
export const PhoneNumber = z.string().optional().meta({ cms: { widget: "phone" } });

const Obj = z.object({
  /** Order code */
  code: z.string().optional().meta({ cms: { hidden: true } }),

  /** Multiline literal */
  multi: z.string().meta({
    cms: { hidden: true },
  }),

  /** Separated by a line comment */
  // The JSDoc plugin skips a schema that already has .meta()
  marked: z.string().meta({ cms: { hidden: true } }),
});

// --- result ---

/**
 * Phone number
 * @title Phone
 * @id PhoneNumber
 * @example +49157
 */
export const PhoneNumber = z.string().optional().meta({ description: "Phone number", title: "Phone", id: "PhoneNumber", examples: [ "+49157" ], cms: { widget: "phone" } });

const Obj = z.object({
  /** Order code */
  code: z.string().optional().meta({ description: "Order code", cms: { hidden: true } }),

  /** Multiline literal */
  multi: z.string().meta({
    description: "Multiline literal",
    cms: { hidden: true },
  }),

  /** Separated by a line comment */
  // The JSDoc plugin skips a schema that already has .meta()
  marked: z.string().meta({ description: "Separated by a line comment", cms: { hidden: true } }),
});
