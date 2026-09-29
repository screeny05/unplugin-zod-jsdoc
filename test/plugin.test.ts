import { describe, it, expect } from "vitest";
import { readFixture, transform } from "./utils";

describe("zodJSDocPlugin", () => {
  describe("Basic functionality", () => {
    it("should not transform schemas without JSDoc", () => {
      const { input } = readFixture("basic/no-transform.ts");
      const result = transform(input);

      expect(result).toBeNull();
    });

    it("should transform on primitives", () => {
      const { input, expected } = readFixture("basic/primitives.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on exported variables", () => {
      const { input, expected } = readFixture("basic/exported.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on objects", () => {
      const { input, expected } = readFixture("basic/objects.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on chained schemas", () => {
      const { input, expected } = readFixture("basic/chained.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on enums", () => {
      const { input, expected } = readFixture("basic/enums.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should not transform on circular schemas", () => {
      const { input, expected } = readFixture("basic/circular.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on arrays", () => {
      const { input, expected } = readFixture("basic/array.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on tuples", () => {
      const { input, expected } = readFixture("basic/tuples.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on unions", () => {
      const { input, expected } = readFixture("basic/unions.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on discriminated unions", () => {
      const { input, expected } = readFixture("basic/discriminated-union.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });
  });

  describe("JSDoc functionality", () => {
    it("should transform on deprecated schemas", () => {
      const { input, expected } = readFixture("jsdoc/deprecated.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on examples", () => {
      const { input, expected } = readFixture("jsdoc/examples.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on extended JSDoc", () => {
      const { input, expected } = readFixture("jsdoc/extended.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });
  });

  describe("Edge cases", () => {
    it("should not transform on existing meta", () => {
      const { input, expected } = readFixture("edge-cases/existing-meta.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should not transform on other comments", () => {
      const { input, expected } = readFixture("edge-cases/other-comments.ts");
      const result = transform(input);

      expect(result?.code).toBeUndefined();
    });

    it("should transform correctly on special characters", () => {
      const { input, expected } = readFixture(
        "edge-cases/special-characters.ts"
      );
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should see through casts, satisfies and parentheses", () => {
      const { input, expected } = readFixture("edge-cases/casts.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should transform on namespaced roots like z.iso", () => {
      const { input, expected } = readFixture("edge-cases/namespace-root.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should attach JSDoc across line comments", () => {
      const { input, expected } = readFixture(
        "edge-cases/line-comment-between.ts"
      );
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });
  });

  describe("mergeExistingMeta", () => {
    const merge = { mergeExistingMeta: true };

    it("should insert missing JSDoc keys into a trailing meta literal", () => {
      const { input, expected } = readFixture("merge/insert-missing.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should never overwrite an explicit key", () => {
      const { input, expected } = readFixture("merge/explicit-wins.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should leave a literal that already has every key untouched", () => {
      const input = `/**
 * Doc
 * @title Title
 */
const s = z.string().meta({ description: "x", title: "y" });`;

      expect(transform(input, "test.ts", merge)).toBeNull();
    });

    it("should insert before spreads and computed keys", () => {
      const { input, expected } = readFixture("merge/literal-shapes.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should merge in every visitor context", () => {
      const { input, expected } = readFixture("merge/contexts.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should skip shapes it cannot merge safely", () => {
      const { input } = readFixture("merge/skip.ts");
      const result = transform(input, "test.ts", merge);

      expect(result).toBeNull();
    });

    it("should append meta without description after a trailing describe", () => {
      const { input, expected } = readFixture("merge/describe.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should merge through casts and namespaced roots", () => {
      const { input, expected } = readFixture("merge/casts.ts");
      const result = transform(input, "test.ts", merge);

      expect(result?.code).toBe(expected);
    });

    it("should keep skipping an existing meta when the option is off", () => {
      const { input } = readFixture("merge/insert-missing.ts");
      const result = transform(input);

      expect(result).toBeNull();
    });
  });
});
