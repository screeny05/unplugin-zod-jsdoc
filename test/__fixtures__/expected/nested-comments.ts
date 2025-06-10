const schema = z.object({
  /** Also a comment */
  bar: z.string().meta({ description: `Also a comment` })
}); 