import { describe, it, expect } from "vitest";
import unplugin from "../src/index";
import { readFileSync } from "fs";
import { join } from "path";

describe("zodJSDocPlugin", () => {
  // Helper function to run transformation
  const transform = (code: string, filename = "test.ts") => {
    const plugin = unplugin.raw({}, {} as any);
    const handler = (plugin.transform as any)?.handler ?? plugin.transform;
    if (typeof handler === "function") {
      return handler.call({} as any, code, filename);
    }
    return null;
  };

  // Helper function to read fixture files
  const readFixture = (filename: string) => {
    return readFileSync(
      join(__dirname, "__fixtures__", filename),
      "utf-8"
    ).trim();
  };

  // Helper function to read expected output files
  const readExpected = (filename: string) => {
    return readFixture(join("expected", filename));
  };

  describe("Basic functionality", () => {
    it("should transform JSDoc comments on zod schemas", () => {
      const input = readFixture("basic-schema.ts");
      const expected = readExpected("basic-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform nested JSDoc comments in object properties", () => {
      const input = readFixture("nested-comments.ts");
      const expected = readExpected("nested-comments.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should not transform code without JSDoc comments", () => {
      const input = readFixture("no-comments.ts");
      const result = transform(input);

      expect(result).toBeNull();
    });

    it("should not transform non-TypeScript files", () => {
      const input = readFixture("no-comments.ts");
      const result = transform(input, "test.js");

      expect(result).toBeNull();
    });

    it("should handle complex JSDoc comments", () => {
      const input = readFixture("complex-comments.ts");
      const expected = readExpected("complex-comments.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Array schemas", () => {
    it("should transform JSDoc comments on array schemas", () => {
      const input = readFixture("array-schema.ts");
      const expected = readExpected("array-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on nested array elements", () => {
      const input = readFixture("nested-array.ts");
      const expected = readExpected("nested-array.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Non-string property types", () => {
    it("should transform JSDoc comments on number properties", () => {
      const input = readFixture("number-property.ts");
      const expected = readExpected("number-property.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on boolean properties", () => {
      const input = readFixture("boolean-property.ts");
      const expected = readExpected("boolean-property.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on date properties", () => {
      const input = readFixture("date-property.ts");
      const expected = readExpected("date-property.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Optional and nullable types", () => {
    it("should transform JSDoc comments on optional properties", () => {
      const input = readFixture("optional-property.ts");
      const expected = readExpected("optional-property.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on nullable properties", () => {
      const input = readFixture("nullable-property.ts");
      const expected = readExpected("nullable-property.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Union types", () => {
    it("should transform JSDoc comments on union schemas", () => {
      const input = readFixture("union-schema.ts");
      const expected = readExpected("union-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on discriminated unions", () => {
      const input = readFixture("discriminated-union.ts");
      const expected = readExpected("discriminated-union.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Enum schemas", () => {
    it("should transform JSDoc comments on enum schemas", () => {
      const input = readFixture("enum-schema.ts");
      const expected = readExpected("enum-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Record and tuple schemas", () => {
    it("should transform JSDoc comments on record schemas", () => {
      const input = readFixture("record-schema.ts");
      const expected = readExpected("record-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on tuple schemas", () => {
      const input = readFixture("tuple-schema.ts");
      const expected = readExpected("tuple-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Nested object schemas", () => {
    it("should transform JSDoc comments on deeply nested objects", () => {
      const input = readFixture("nested-object.ts");
      const expected = readExpected("nested-object.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Refined and transformed schemas", () => {
    it("should transform JSDoc comments on refined schemas", () => {
      const input = readFixture("refined-schema.ts");
      const expected = readExpected("refined-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should transform JSDoc comments on transformed schemas", () => {
      const input = readFixture("transformed-schema.ts");
      const expected = readExpected("transformed-schema.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });

  describe("Edge cases", () => {
    it("should handle JSDoc comments with special characters", () => {
      const input = readFixture("special-characters.ts");
      const expected = readExpected("special-characters.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should not overwrite existing meta calls", () => {
      const input = readFixture("existing-meta.ts");
      const expected = readExpected("existing-meta.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should handle multiline JSDoc with @tags", () => {
      const input = readFixture("multiline-jsdoc.ts");
      const expected = readExpected("multiline-jsdoc.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });

    it("should not transform regular block comments", () => {
      const input = readFixture("regular-comments.ts");
      const result = transform(input);

      expect(result).toBeNull();
    });

    it("should handle multiple schemas in one file", () => {
      const input = readFixture("multiple-schemas.ts");
      const expected = readExpected("multiple-schemas.ts");
      const result = transform(input);

      expect(result).toBeTruthy();
      expect(result.code).toBe(expected);
    });
  });
});
