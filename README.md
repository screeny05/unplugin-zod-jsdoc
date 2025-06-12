# unplugin-zod-jsdoc

[![npm](https://img.shields.io/npm/v/unplugin-zod-jsdoc.svg)](https://npmjs.com/package/unplugin-zod-jsdoc)

Universal plugin for transforming JSDoc comments on Zod schemas into runtime metadata.

## Features

- 🔄 Universal: Works with Vite, Rollup, Rolldown, webpack, Rspack, esbuild, and Farm
- 📝 Transforms JSDoc comments into Zod v4 `.meta()` calls
- 🎯 TypeScript support
- ⚡ Fast and efficient by using the [oxc-toolchain](https://oxc.rs/docs/guide/usage/parser)
- 🛠 Zero configuration required

> [!IMPORTANT]
> This plugin only works with Zod >= 3.25.0 and < 4.0.0.
>
> You need to import `zod/v4` instead of `zod` to use this plugin.

## Installation

```bash
npm install unplugin-zod-jsdoc --save-dev
```

## Configuration

###### Build Tools

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import ZodJsdoc from "unplugin-zod-jsdoc/vite";

export default defineConfig({
  plugins: [ZodJsdoc()],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```javascript
// rollup.config.js
import ZodJsdoc from "unplugin-zod-jsdoc/rollup";

export default {
  plugins: [ZodJsdoc()],
};
```

<br></details>

<details>
<summary>Rolldown</summary><br>

```javascript
// rolldown.config.js
import ZodJsdoc from "unplugin-zod-jsdoc/rolldown";

export default {
  plugins: [ZodJsdoc()],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```javascript
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require("unplugin-zod-jsdoc/webpack")()],
};
```

<br></details>

<details>
<summary>Rspack</summary><br>

```javascript
// rspack.config.js
module.exports = {
  /* ... */
  plugins: [require("unplugin-zod-jsdoc/rspack")()],
};
```

<br></details>

<details>
<summary>ESBuild</summary><br>

```javascript
// esbuild.config.js
import { build } from "esbuild";
import ZodJsdoc from "unplugin-zod-jsdoc/esbuild";

build({
  plugins: [ZodJsdoc()],
});
```

<br></details>

<details>
<summary>Farm</summary><br>

```typescript
// farm.config.ts
import ZodJsdoc from "unplugin-zod-jsdoc/farm";

export default defineConfig({
  plugins: [ZodJsdoc()],
});
```

<br></details>

## Options

You can pass optional options to the plugin for further customization.

```typescript
interface PluginOptions {
  /**
   * Enable in development mode.
   * Can improve performance by disabling the transformation in development.
   * @default true
   */
  enableInDev?: boolean;
}
```

## Example

### Input

```typescript
/**
 * User's full name.
 * Second line in description.
 */
const nameSchema = z.string().min(1);

/**
 * User's email address
 */
const emailSchema = z.string().email();

const userSchema = z.object({
  /**
   * Unique identifier for the user
   */
  id: z.string().uuid(),
  name: nameSchema,
  email: emailSchema,
});
```

### Output

```typescript
/**
 * User's full name.
 * Second line in description.
 */
const nameSchema = z
  .string()
  .min(1)
  .meta({ description: `User's full name. Second line in description.` });

/**
 * User's email address
 */
const emailSchema = z
  .string()
  .email()
  .meta({ description: `User's email address` });

const userSchema = z.object({
  /**
   * Unique identifier for the user
   */
  id: z.string().uuid().meta({ description: `Unique identifier for the user` }),
  name: nameSchema,
  email: emailSchema,
});
```

As you can see, newlines are not preserved in the output.

## JSON Schema

The plugin can also be used to add additional metadata specific for JSON Schema generation.

For this, the following jsdoc-tags are supported:

- `@example`
- `@id`
- `@title`
- `@deprecated`

### Example:

```typescript
/**
 * An object representing a logged-in user
 * @id User
 * @title User Schema
 * @example { id: '123-456 }
 * @deprecated Superseded by User2
 */
const userSchema = z.object({
  /** Unique identifier for the user */
  id: z.string(),
});

const dataSchema = z.object({
  user1: userSchema,
  user2: userSchema,
});

const jsonSchema = z.toJSONSchema(dataSchema, { target: 'draft-7', reused: 'ref' });

console.log(jsonSchema); // =>
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "user1": { "$ref": "#/definitions/User" },
    "user2": { "$ref": "#/definitions/User" }
  },
  "required": ["user1", "user2"],
  "additionalProperties": false,
  "definitions": {
    "User": {
      "description": "An object representing a logged-in user",
      "title": "User Schema",
      "examples": ["{ id: '123-456' }"],
      "id": "User",
      "deprecated": true,
      "type": "object",
      "properties": {
        "id": {
          "description": "The unique identifier for the user",
          "type": "string"
        },
      },
      "required": ["id"],
      "additionalProperties": false
    }
  }
}
```

## How it works

The plugin:

1. **Parses TypeScript/JavaScript** files looking for Zod schemas
2. **Finds JSDoc comments** that precede zod-calls
3. **Transforms comments** into `.meta({ description: "..." })` calls
4. **Preserves existing** `.meta()` or `.description()` calls (doesn't override them)

## License

[MIT](./LICENSE.md) License © 2025
