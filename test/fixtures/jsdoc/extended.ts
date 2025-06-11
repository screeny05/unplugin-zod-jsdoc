/**
 * Extended JSDoc schema
 * @title Hello World
 * @id hello_world
 */
const sExtended = z.string();

// --- result ---

/**
 * Extended JSDoc schema
 * @title Hello World
 * @id hello_world
 */
const sExtended = z.string().meta({ description: "Extended JSDoc schema", title: "Hello World", id: "hello_world" });