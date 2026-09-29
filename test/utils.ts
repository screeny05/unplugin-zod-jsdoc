import unplugin, { type PluginOptions } from "../src/index";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Read a fixture file and return the input and expected code
 */
export const readFixture = (filename: string) => {
  const content = readFileSync(join(__dirname, "fixtures", filename), "utf-8");
  const split = content.split("// --- result ---").map((part) => part.trim());
  if (split.length !== 2) {
    throw new Error("Fixture does not contain result");
  }
  return {
    input: split[0],
    expected: split[1],
  };
};

/**
 * Helper to transform input code with the plugin
 */
export const transform = (
  code: string,
  filename = "test.ts",
  options: PluginOptions = {}
) => {
  const plugin = unplugin.raw(options, {} as any);
  const handler = (plugin.transform as any)?.handler ?? plugin.transform;
  if (typeof handler === "function") {
    return handler.call({} as any, code, filename);
  }
  return null;
};

/**
 * Whether the plugin's `code` filter lets a source through, with unplugin's semantics: a string
 * matches as a substring, a RegExp by `test`, and any include pattern admits the file
 */
export const passesCodeFilter = (code: string, options: PluginOptions) => {
  const plugin = unplugin.raw(options, {} as any);
  const include: (string | RegExp)[] =
    (plugin.transform as any)?.filter?.code?.include ?? [];
  return include.some((pattern) =>
    typeof pattern === "string" ? code.includes(pattern) : pattern.test(code)
  );
};
