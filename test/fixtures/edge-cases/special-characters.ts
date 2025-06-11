const schema = z.object({
  /** User's "special" field with ${symbols} & other chars */
  special: z.string()
});

// --- result ---

const schema = z.object({
  /** User's "special" field with ${symbols} & other chars */
  special: z.string().meta({ description: "User's \"special\" field with ${symbols} & other chars" })
});