/**
 * Category schema
 */
const Category = z.object({
  /**
   * Name of the category
   */
  name: z.string(),

  /**
   * Not transformed
   */
  get subcategories(){
    /**
     * Also not transformed
     */
    return z.array(Category)
  }
});

// --- result ---

/**
 * Category schema
 */
const Category = z.object({
  /**
   * Name of the category
   */
  name: z.string().meta({ description: "Name of the category" }),

  /**
   * Not transformed
   */
  get subcategories(){
    /**
     * Also not transformed
     */
    return z.array(Category)
  }
}).meta({ description: "Category schema" });