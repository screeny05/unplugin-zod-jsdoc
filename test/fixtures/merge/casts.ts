const sObject = z.object({
  /** Well-known action */
  action: (z.string() as z.ZodType<WellKnown>).optional().meta({ cms: 1 }),
});

/**
 * Calendar date
 * @id CalendarDate
 */
export const CalendarDate = z.iso.date().meta({ description: "Short", cms: 1 });

/** Cast after meta */
const sCastAfter = z.string().meta({ cms: 1 }) as z.ZodType<Foo>;

// --- result ---

const sObject = z.object({
  /** Well-known action */
  action: (z.string() as z.ZodType<WellKnown>).optional().meta({ description: "Well-known action", cms: 1 }),
});

/**
 * Calendar date
 * @id CalendarDate
 */
export const CalendarDate = z.iso.date().meta({ id: "CalendarDate", description: "Short", cms: 1 });

/** Cast after meta */
const sCastAfter = z.string().meta({ description: "Cast after meta", cms: 1 }) as z.ZodType<Foo>;
