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
   * Enable in development mode
   * @default true
   */
  enableInDev?: boolean;
}
```

## Example

### Input

```typescript
/**
 * User's full name
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
 * User's full name
 */
const nameSchema = z.string().min(1).meta({ description: `User's full name` });

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

## How it works

The plugin:

1. **Parses TypeScript/JavaScript** files looking for Zod schemas
2. **Finds JSDoc comments** that precede zod-calls
3. **Transforms comments** into `.meta({ description: "..." })` calls
4. **Preserves existing** `.meta()` or `.description()` calls (doesn't override them)

## License

[MIT](./LICENSE.md) License © 2025
