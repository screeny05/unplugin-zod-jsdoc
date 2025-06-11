/**
 * Examples schema
 * @example
 * const sExamples = z.string();
 */
const sExamples = z.string();

/**
 * Examples schema with multiple examples. Note that the newlines are not preserved.
 * @example
 * const sExample1 = z.string();
 * @example
 * ```ts
 * const sExample2 = z.string();
 * console.log(sExample2);
 * ```
 */
const sExamplesMultiple = z.string();

/**
 * Examples schema with a type example
 * @example
 * {string}
 */
const sExamplesType = z.string();

// --- result ---

/**
 * Examples schema
 * @example
 * const sExamples = z.string();
 */
const sExamples = z.string().meta({ description: "Examples schema", examples: [ "const sExamples = z.string();" ] });

/**
 * Examples schema with multiple examples. Note that the newlines are not preserved.
 * @example
 * const sExample1 = z.string();
 * @example
 * ```ts
 * const sExample2 = z.string();
 * console.log(sExample2);
 * ```
 */
const sExamplesMultiple = z.string().meta({ description: "Examples schema with multiple examples. Note that the newlines are not preserved.", examples: [ "const sExample1 = z.string();", "```ts const sExample2 = z.string(); console.log(sExample2); ```" ] });

/**
 * Examples schema with a type example
 * @example
 * {string}
 */
const sExamplesType = z.string().meta({ description: "Examples schema with a type example", examples: [ "{string}" ] });