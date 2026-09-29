/**
 * JSDoc description
 * @title JSDoc title
 */
const sDescription = z.string().meta({ description: "Explicit", cms: 1 });

/**
 * JSDoc description
 * @title JSDoc title
 * @id jsdoc_id
 */
const sQuotedKeys = z.string().meta({ "title": "Explicit title", 'id': "explicit_id" });

/**
 * JSDoc description
 */
const sShorthand = z.string().meta({ description });

// --- result ---

/**
 * JSDoc description
 * @title JSDoc title
 */
const sDescription = z.string().meta({ title: "JSDoc title", description: "Explicit", cms: 1 });

/**
 * JSDoc description
 * @title JSDoc title
 * @id jsdoc_id
 */
const sQuotedKeys = z.string().meta({ description: "JSDoc description", "title": "Explicit title", 'id': "explicit_id" });

/**
 * JSDoc description
 */
const sShorthand = z.string().meta({ description });
