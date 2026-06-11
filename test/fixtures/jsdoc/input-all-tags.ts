/**
 * Schema with all JSDoc tags
 * @id test_schema
 * @title Test Schema
 * @deprecated Use newSchema instead
 * @example { value: 'test' }
 */
const sTest = z.string();

// --- result ---

/**
 * Schema with all JSDoc tags
 * @id test_schema
 * @title Test Schema
 * @deprecated Use newSchema instead
 * @example { value: 'test' }
 */
const sTest = z.string().meta({ description: "Schema with all JSDoc tags", deprecated: true, title: "Test Schema", id: "test_schema", examples: [ "{value: 'test'}" ] });
