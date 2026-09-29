/** Calendar date */
export const CalendarDate = z.iso.date();

/** Date time */
export const DateTime = z.iso.datetime({ offset: true }).optional();

const sObject = z.object({
  /** Deeply nested namespace */
  deep: z.a.b.c(),
});

/** Not zod */
const sNotZod = foo.iso.date();

/** Computed namespace */
const sComputed = z[key].date();

// --- result ---

/** Calendar date */
export const CalendarDate = z.iso.date().meta({ description: "Calendar date" });

/** Date time */
export const DateTime = z.iso.datetime({ offset: true }).optional().meta({ description: "Date time" });

const sObject = z.object({
  /** Deeply nested namespace */
  deep: z.a.b.c().meta({ description: "Deeply nested namespace" }),
});

/** Not zod */
const sNotZod = foo.iso.date();

/** Computed namespace */
const sComputed = z[key].date();
