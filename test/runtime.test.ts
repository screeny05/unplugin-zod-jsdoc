import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { z } from "zod/v4";
import { transform } from "./utils";
import type { PluginOptions } from "../src/index";

// Written inside the repo so the module resolves `zod/v4` from its node_modules and shares
// the global registry with the `z` imported above.
const tmpDir = join(__dirname, ".tmp");
let counter = 0;

const load = async (
  source: string,
  options: PluginOptions
): Promise<Record<string, any>> => {
  const code = `import { z } from "zod/v4";\n${source}`;
  const result = transform(code, "runtime.ts", options);
  if (!result) throw new Error("The plugin left the source untouched");

  mkdirSync(tmpDir, { recursive: true });
  const file = join(tmpDir, `runtime-${process.pid}-${counter++}.ts`);
  writeFileSync(file, result.code);
  return import(file);
};

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe("runtime metadata", () => {
  it("merges JSDoc keys into a trailing meta without overriding explicit ones", async () => {
    const mod = await load(
      `
const base = { title: "From spread" };

export const Schema = z.object({
  /**
   * JSDoc description
   * @title JSDoc title
   * @id runtime_merge_field
   */
  field: z.string().optional().meta({ description: "Explicit", cms: { hidden: true } }),

  /**
   * Only in JSDoc
   * @title JSDoc title
   */
  spread: z.string().meta({ ...base, cms: 1 }),

  /** Added by the plugin */
  plain: z.number().meta({ cms: 2 }),
});
`,
      { mergeExistingMeta: true }
    );

    const { field, spread, plain } = mod.Schema.shape;

    expect(field.meta()).toEqual({
      title: "JSDoc title",
      id: "runtime_merge_field",
      description: "Explicit",
      cms: { hidden: true },
    });
    expect(spread.meta()).toEqual({
      description: "Only in JSDoc",
      title: "From spread",
      cms: 1,
    });
    expect(plain.meta()).toEqual({
      description: "Added by the plugin",
      cms: 2,
    });

    const json = z.toJSONSchema(mod.Schema) as any;
    expect(json.properties.spread).toMatchObject({
      type: "string",
      description: "Only in JSDoc",
      title: "From spread",
      cms: 1,
    });
    expect(json.properties.plain).toMatchObject({
      type: "number",
      description: "Added by the plugin",
      cms: 2,
    });
    expect(JSON.stringify(json)).not.toContain("JSDoc description");
  });

  it("keeps an explicit describe() and adds the remaining JSDoc keys", async () => {
    const mod = await load(
      `
/**
 * JSDoc description
 * @title JSDoc title
 */
export const Described = z.string().describe("Explicit");
`,
      { mergeExistingMeta: true }
    );

    expect(mod.Described.meta()).toEqual({
      description: "Explicit",
      title: "JSDoc title",
    });
    expect(z.toJSONSchema(mod.Described)).toMatchObject({
      description: "Explicit",
      title: "JSDoc title",
    });
  });

  it("never overrides describe() when the option is off", async () => {
    const mod = await load(
      `
/** JSDoc description */
export const Described = z.string().describe("Explicit");

/** Forces a transform */
export const Plain = z.string();
`,
      {}
    );

    expect(mod.Described.description).toBe("Explicit");
    expect(mod.Plain.description).toBe("Forces a transform");
  });

  it("attaches meta to cast and namespaced schemas", async () => {
    const mod = await load(
      `
type WellKnown = "a" | "b";

export const Schema = z.object({
  /** Cast, then chained */
  action: (z.string() as z.ZodType<WellKnown>).optional(),
  /** Trailing cast */
  kind: z.string() as unknown as z.ZodType<WellKnown>,
  /** Calendar date */
  date: z.iso.date(),
});

/** Object cast */
export const Typed = z.object({ name: z.string() }) as z.ZodType<{ name: string }>;
`,
      {}
    );

    const { action, kind, date } = mod.Schema.shape;
    expect(action.description).toBe("Cast, then chained");
    expect(kind.description).toBe("Trailing cast");
    expect(date.description).toBe("Calendar date");
    expect(mod.Typed.description).toBe("Object cast");
    expect(date.parse("2026-09-29")).toBe("2026-09-29");
  });
});
