import unplugin from "../src/index";
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
export const transform = (code: string, filename = "test.ts") => {
  const plugin = unplugin.raw({}, {} as any);
  const handler = (plugin.transform as any)?.handler ?? plugin.transform;
  if (typeof handler === "function") {
    return handler.call({} as any, code, filename);
  }
  return null;
};
