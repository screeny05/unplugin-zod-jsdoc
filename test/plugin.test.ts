import { describe, it, expect } from "vitest";
import { readFixture, transform, transformWithOptions } from "./utils";

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
  });

  describe("Tag options", () => {
    it("should include all tags by default", () => {
      const { input, expected } = readFixture("jsdoc/input-all-tags.ts");
      const result = transform(input);

      expect(result?.code).toBe(expected);
    });

    it("should skip title and example when disabled", () => {
      const { input } = readFixture("jsdoc/input-all-tags.ts");
      const result = transformWithOptions(input, {
        tags: { title: false, example: false },
      });
      const { expected } = readFixture("jsdoc/output-title-example-disabled.ts");

      expect(result?.code).toBe(expected);
    });

    it("should skip all extra tags when all disabled", () => {
      const { input } = readFixture("jsdoc/input-all-tags.ts");
      const result = transformWithOptions(input, {
        tags: { id: false, title: false, deprecated: false, example: false },
      });
      const { expected } = readFixture("jsdoc/output-all-disabled.ts");

      expect(result?.code).toBe(expected);
    });
  });
});
