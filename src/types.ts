export interface JSDocTagOptions {
  /**
   * Enable `@deprecated` tag → `.meta({ deprecated: true })`
   * @default true
   */
  deprecated?: boolean;
  /**
   * Enable `@title` tag → `.meta({ title: "..." })`
   * @default true
   */
  title?: boolean;
  /**
   * Enable `@id` tag → `.meta({ id: "..." })`
   * @default true
   */
  id?: boolean;
  /**
   * Enable `@example` tag → `.meta({ examples: [...] })`
   * @default true
   */
  example?: boolean;
}

export interface PluginOptions {
  /**
   * Enable in development mode.
   * Can improve performance by disabling the transformation in development.
   * @default true
   */
  enableInDev?: boolean;
  /**
   * Control which JSDoc tags are transformed into `.meta()` calls.
   * All tags are enabled by default.
   */
  tags?: JSDocTagOptions;
}
