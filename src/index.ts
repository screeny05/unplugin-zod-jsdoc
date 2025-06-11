import { createUnplugin, UnpluginFactory, UnpluginInstance } from "unplugin";
import oxc, { Comment, Node, ObjectProperty } from "oxc-parser";
import MagicString from "magic-string";
import { walk } from "oxc-walker";
import { parse, Spec } from "comment-parser";
import { genObjectFromValues } from "knitwork";

export interface PluginOptions {
  /**
   * Enable in development mode
   * @default true
   */
  enableInDev?: boolean;
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (
  options = {}
) => {
  const { enableInDev = true } = options;

  let isDev = false;

  return {
    name: "unplugin-zod-jsdoc",
    buildStart() {
      // Detect if we're in development mode
      isDev =
        process.env.NODE_ENV === "development" ||
        ((this as any).meta?.framework === "vite" &&
          (this as any).meta?.vite?.command === "serve");
    },
    transform: {
      filter: {
        id: {
          include: [
            /\.vue$/,
            /\.vue(\.[tj]sx?)?\?vue/,
            /\.vue\?v=/,
            /\.ts$/,
            /\.tsx$/,
            /\.js$/,
            /\.jsx$/,
            /\.svelte$/,
            /\.astro$/,
          ],
          exclude: [
            /[\\/]node_modules[\\/]/,
            /[\\/]\.git[\\/]/,
            /[\\/]\.nuxt[\\/]/,
          ],
        },
        code: {
          include: [/from\s*['"]zod\/v4['"]/],
        },
      },
      handler(code, id) {
        // Skip processing in development if enableInDev is false
        if (isDev && !enableInDev) {
          return null;
        }

        try {
          const result = oxc.parseSync(id, code);
          const ast = result.program;

          const magicString = new MagicString(code);
          const transformations: Array<{
            start: number;
            replacement: string;
          }> = [];

          // Get all comments from the AST
          const comments = result.comments || [];

          // Use oxc-walker to traverse the AST
          walk(ast, {
            enter(node) {
              // Handle variable declarations
              if (node.type === "VariableDeclaration") {
                const varDeclaration = node;
                for (const declaration of varDeclaration.declarations) {
                  if (
                    declaration.init &&
                    isZodExpression(declaration.init) &&
                    !hasExistingMetaCall(declaration.init)
                  ) {
                    const jsdocComment = getJSDocCommentForNode(
                      node,
                      comments,
                      code
                    );
                    if (jsdocComment) {
                      const metaCall = createMetaCall(jsdocComment);
                      const zodExpression = declaration.init;

                      // Add .meta() call to the end of the zod expression
                      transformations.push({
                        start: zodExpression.end,
                        replacement: metaCall,
                      });
                    }
                  }
                }
              }

              // Handle object properties
              if (node.type === "Property") {
                const property = node as ObjectProperty;
                if (
                  property.value &&
                  isZodExpression(property.value) &&
                  !hasExistingMetaCall(property.value)
                ) {
                  const jsdocComment = getJSDocCommentForNode(
                    node,
                    comments,
                    code
                  );
                  if (jsdocComment) {
                    const metaCall = createMetaCall(jsdocComment);
                    const zodExpression = property.value;

                    transformations.push({
                      start: zodExpression.end,
                      replacement: metaCall,
                    });
                  }
                }
              }

              // Handle array elements and discriminated union elements
              if (node.type === "ArrayExpression") {
                for (const element of node.elements) {
                  if (
                    element &&
                    isZodExpression(element) &&
                    !hasExistingMetaCall(element)
                  ) {
                    const jsdocComment = getJSDocCommentForNode(
                      element,
                      comments,
                      code
                    );
                    if (jsdocComment) {
                      const metaCall = createMetaCall(jsdocComment);
                      const zodExpression = element;

                      transformations.push({
                        start: zodExpression.end,
                        replacement: metaCall,
                      });
                    }
                  }
                }
              }

              /**
               * Handle JSDoc on arguments of Zod calls (e.g., z.array(...), z.union([...]), z.tuple([...]), z.discriminatedUnion(...))
               *
               * E.g.
               * z.array(
               *   /**
               *    * This docblock will be transformed to a .meta() call
               *    * /
               *   z.string()
               * );
               */
              if (node.type === "CallExpression") {
                for (const arg of node.arguments) {
                  if (isZodExpression(arg) && !hasExistingMetaCall(arg)) {
                    const jsdocComment = getJSDocCommentForNode(
                      arg,
                      comments,
                      code
                    );
                    if (jsdocComment) {
                      const metaCall = createMetaCall(jsdocComment);
                      transformations.push({
                        start: arg.end,
                        replacement: metaCall,
                      });
                    }
                  }
                }
              }
            },
          });

          // Apply transformations in reverse order to maintain correct positions
          transformations
            .sort((a, b) => b.start - a.start)
            .forEach(({ start, replacement }) => {
              magicString.appendRight(start, replacement);
            });

          if (transformations.length > 0) {
            return {
              code: magicString.toString(),
              map: magicString.generateMap({ hires: true }),
            };
          }

          return null;
        } catch (error) {
          // If parsing fails, return original code
          console.warn(`Failed to parse ${id}:`, error);
          return null;
        }
      },
    },
  };
};

/**
 * Check if a node represents a Zod expression
 */
function isZodExpression(node: Node): boolean {
  if (node.type !== "CallExpression") {
    return false;
  }

  const callee = node.callee;

  // Check for z.something() pattern
  if (
    callee.type === "MemberExpression" &&
    callee.object.type === "Identifier" &&
    callee.object.name === "z"
  ) {
    return true;
  }

  // Check for chained calls like z.string().optional()
  if (callee.type === "MemberExpression" && isZodExpression(callee.object)) {
    return true;
  }

  return false;
}

/**
 * Check if a Zod expression already has a .meta() or .description() call
 */
function hasExistingMetaCall(node: Node): boolean {
  if (node.type !== "CallExpression") {
    return false;
  }

  const callee = node.callee;

  // Check if this is a .meta() or .description() call
  if (
    callee.type === "MemberExpression" &&
    callee.property.type === "Identifier" &&
    (callee.property.name === "meta" || callee.property.name === "description")
  ) {
    return true;
  }

  // Check for chained calls - recursively check the object
  if (
    callee.type === "MemberExpression" &&
    callee.object.type === "CallExpression"
  ) {
    return hasExistingMetaCall(callee.object);
  }

  return false;
}

/**
 * Get JSDoc comment for a node by finding comments that precede it
 */
function getJSDocCommentForNode(
  node: Node,
  comments: Comment[],
  code: string
): string | null {
  if (!comments || comments.length === 0 || !node.start) return null;

  // Find comments that appear before this node with minimal whitespace in between
  const precedingComments = comments.filter((comment: Comment) => {
    return (
      comment.type === "Block" &&
      comment.value.includes("*") &&
      comment.end < node.start
    );
  });

  if (precedingComments.length === 0) return null;

  // Get the closest preceding comment
  const closestComment = precedingComments.reduce(
    (closest: Comment, current: Comment) => {
      return current.end > closest.end ? current : closest;
    }
  );

  // Check if the comment is directly before this node (with only whitespace in between)
  const textBetween = code.substring(closestComment.end, node.start);
  const isDirectlyPreceding = /^\s*$/.test(textBetween);

  if (!isDirectlyPreceding) return null;

  return `/**\n${closestComment.value}\n*/`;
}

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
function createMetaCall(description: string): string {
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

  if (deprecated) {
    meta.deprecated = true;
  }

  if (title) {
    meta.title = commentTagToRaw(title);
  }

  if (id) {
    meta.id = commentTagToRaw(id);
  }

  if (examples.length > 0) {
    meta.examples = examples.map((example) => commentTagToRaw(example));
  }

  return `.meta(${genObjectFromValues(meta)})`
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ");
}

// Create the unplugin instance
export const unplugin: UnpluginInstance<PluginOptions | undefined, false> =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

// Default export following unplugin conventions
export default unplugin;
