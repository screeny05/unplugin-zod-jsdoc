/** JSDoc description */
const sOnlyDescription = z.string().describe("Explicit");

/**
 * JSDoc description
 * @title JSDoc title
 * @id jsdoc_id
 */
const sWithTags = z.string().describe("Explicit");

/**
 * JSDoc description
 * @title JSDoc title
 */
const sMiddle = z.string().describe("Explicit").optional();

// --- result ---

/** JSDoc description */
const sOnlyDescription = z.string().describe("Explicit");

/**
 * JSDoc description
 * @title JSDoc title
 * @id jsdoc_id
 */
const sWithTags = z.string().describe("Explicit").meta({ title: "JSDoc title", id: "jsdoc_id" });

/**
 * JSDoc description
 * @title JSDoc title
 */
const sMiddle = z.string().describe("Explicit").optional();
