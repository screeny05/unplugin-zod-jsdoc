import { parse, Spec } from "comment-parser";
import { genObjectFromValues } from "knitwork";
import type { JSDocTagOptions } from "./types";

/**
 * Turns a JSDoc tag back into a raw string
 */
function commentTagToRaw(tag: Spec): string {
  return [tag.name, tag.description, tag.type ? `{${tag.type}}` : ""]
    .filter(Boolean)
    .join(" ");
}

/**
 * Create a .meta() call with the description
 */
export function createMetaCall(
  description: string,
  tagOptions?: JSDocTagOptions
): string {
  const parsed = parse(description).at(0);
  if (!parsed) {
    return "";
  }

  const meta: Record<string, any> = {
    description: parsed.description.replace(/\s+/g, " ").trim(),
  };

  const id = parsed.tags.find((tag) => tag.tag === "id");
  const title = parsed.tags.find((tag) => tag.tag === "title");
  const deprecated = parsed.tags.find((tag) => tag.tag === "deprecated");
  const examples = parsed.tags.filter((tag) => tag.tag === "example");

  if (deprecated && tagOptions?.deprecated !== false) {
    meta.deprecated = true;
  }

  if (title && tagOptions?.title !== false) {
    meta.title = commentTagToRaw(title);
  }

  if (id && tagOptions?.id !== false) {
    meta.id = commentTagToRaw(id);
  }

  if (examples.length > 0 && tagOptions?.example !== false) {
    meta.examples = examples.map((example) => commentTagToRaw(example));
  }

  return `.meta(${genObjectFromValues(meta)})`
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ");
}
