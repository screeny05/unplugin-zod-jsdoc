# unplugin-zod-jsdoc

[![npm](https://img.shields.io/npm/v/unplugin-zod-jsdoc.svg)](https://npmjs.com/package/unplugin-zod-jsdoc)

Universal plugin for transforming JSDoc comments on Zod schemas into runtime metadata.

## Features

- 🔄 Universal: Works with Vite, Rollup, Rolldown, webpack, Rspack, esbuild, and Farm
- 📝 Transforms JSDoc comments into Zod `.meta()` calls
- 🎯 TypeScript support
- ⚡ Fast and efficient with smart filtering
- 🛠 Zero configuration required

## Installation

```bash
npm install unplugin-zod-jsdoc --save-dev
```

## Usage

### Vite

```typescript
// vite.config.ts
import UnpluginZodJsdoc from "unplugin-zod-jsdoc/vite";

export default defineConfig({
  plugins: [
    UnpluginZodJsdoc({
      /* options */
    }),
  ],
});
```

### Rollup

```javascript
// rollup.config.js
import UnpluginZodJsdoc from "unplugin-zod-jsdoc/rollup";

export default {
  plugins: [
    UnpluginZodJsdoc({
      /* options */
    }),
  ],
};
```

### Rolldown

```javascript
// rolldown.config.js
import UnpluginZodJsdoc from "unplugin-zod-jsdoc/rolldown";

export default {
  plugins: [
    UnpluginZodJsdoc({
      /* options */
    }),
  ],
};
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-zod-jsdoc/webpack")({
      /* options */
    }),
  ],
};
```

### Rspack

```javascript
// rspack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-zod-jsdoc/rspack")({
      /* options */
    }),
  ],
};
```

### ESBuild

```javascript
// esbuild.config.js
import { build } from "esbuild";
import UnpluginZodJsdoc from "unplugin-zod-jsdoc/esbuild";

build({
  plugins: [UnpluginZodJsdoc()],
});
```

### Farm

```typescript
// farm.config.ts
import UnpluginZodJsdoc from "unplugin-zod-jsdoc/farm";

export default defineConfig({
  plugins: [
    UnpluginZodJsdoc({
      /* options */
    }),
  ],
});
```

## Options

```typescript
interface PluginOptions {
  /**
   * File extensions to process
   * @default ['.ts', '.tsx']
   */
  include?: string[];

  /**
   * File patterns to exclude
   * @default []
   */
  exclude?: string[];

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
2. **Finds JSDoc comments** that precede variable declarations or object properties
3. **Transforms comments** into `.meta({ description: "..." })` calls
4. **Preserves existing** `.meta()` calls (doesn't duplicate them)
5. **Uses smart filtering** for optimal performance - only processes files with Zod usage

## License

[MIT](./LICENSE.md) License © 2025
