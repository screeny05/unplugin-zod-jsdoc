import { createUnplugin, UnpluginFactory, UnpluginInstance } from "unplugin";
import { parse } from "@typescript-eslint/typescript-estree";
import MagicString from "magic-string";
import type { TSESTree } from "@typescript-eslint/typescript-estree";

export interface PluginOptions {
  /**
   * File extensions to process
   * @default ['.ts', '.tsx']
   */
  include?: string[];
  /**
   * File patterns to exclude
   */
  exclude?: string[];
  /**
   * Enable in development mode
   * @default true
   */
  enableInDev?: boolean;
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (
  options = {}
) => {
  const {
    include = [".ts", ".tsx"],
    exclude = [],
    enableInDev = true,
  } = options;

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
    transformInclude(id) {
      // Check if file should be processed based on include/exclude patterns
      const shouldInclude = include.some((ext) =>
        ext.startsWith(".") ? id.endsWith(ext) : id.includes(ext)
      );
      const shouldExclude = exclude.some((pattern) => id.includes(pattern));
      return shouldInclude && !shouldExclude;
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
          const ast = parse(code, {
            loc: true,
            range: true,
            comment: true,
            attachComments: true,
            jsx: id.endsWith(".tsx"),
          });

          const magicString = new MagicString(code);
          const transformations: Array<{
            start: number;
            replacement: string;
          }> = [];

          // Get all comments from the AST
          const comments = (ast as any).comments || [];

          // Find all JSDoc comments and their associated nodes
          const processNode = (node: TSESTree.Node) => {
            // Look for variable declarations with JSDoc comments
            if (node.type === "VariableDeclaration") {
              for (const declaration of node.declarations) {
                if (declaration.init && isZodExpression(declaration.init)) {
                  // Skip if the expression already has a .meta() call
                  if (hasExistingMetaCall(declaration.init)) {
                    continue;
                  }

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
                      start: zodExpression.range![1],
                      replacement: metaCall,
                    });
                  }
                }
              }
            }

            // Look for object properties with JSDoc comments (for nested schemas)
            if (
              node.type === "Property" &&
              node.value &&
              isZodExpression(node.value)
            ) {
              // Skip if the expression already has a .meta() call
              if (hasExistingMetaCall(node.value)) {
                return;
              }

              const jsdocComment = getJSDocCommentForNode(node, comments, code);
              if (jsdocComment) {
                const metaCall = createMetaCall(jsdocComment);
                const zodExpression = node.value;

                transformations.push({
                  start: zodExpression.range![1],
                  replacement: metaCall,
                });
              }
            }

            // Recursively process child nodes
            for (const key in node) {
              const child = (node as any)[key];
              if (child && typeof child === "object") {
                if (Array.isArray(child)) {
                  child.forEach((item) => {
                    if (item && typeof item === "object" && item.type) {
                      processNode(item);
                    }
                  });
                } else if (child.type) {
                  processNode(child);
                }
              }
            }
          };

          processNode(ast);

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
function isZodExpression(node: TSESTree.Node): boolean {
  if (node.type === "CallExpression") {
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
  }

  return false;
}

/**
 * Check if a Zod expression already has a .meta() call
 */
function hasExistingMetaCall(node: TSESTree.Node): boolean {
  if (node.type === "CallExpression") {
    const callee = node.callee;

    // Check if this is a .meta() call
    if (
      callee.type === "MemberExpression" &&
      callee.property.type === "Identifier" &&
      callee.property.name === "meta"
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
  }

  return false;
}

/**
 * Extract JSDoc comment text from a comment block
 */
function extractJSDocText(commentValue: string): string {
  return commentValue
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        (line && !line.startsWith("*")) ||
        (line.startsWith("*") && line.length > 1)
    )
    .map((line) => line.replace(/^\*\s?/, ""))
    .join(" ")
    .trim();
}

/**
 * Get JSDoc comment for a node by finding comments that precede it
 */
function getJSDocCommentForNode(
  node: TSESTree.Node,
  comments: any[],
  code: string
): string | null {
  if (!comments || comments.length === 0 || !node.range) return null;

  // Find comments that appear before this node with minimal whitespace in between
  const precedingComments = comments.filter((comment: any) => {
    return (
      comment.type === "Block" &&
      comment.value.includes("*") &&
      comment.range[1] < node.range![0]
    );
  });

  if (precedingComments.length === 0) return null;

  // Get the closest preceding comment
  const closestComment = precedingComments.reduce(
    (closest: any, current: any) => {
      return current.range[1] > closest.range[1] ? current : closest;
    }
  );

  // Check if the comment is directly before this node (with only whitespace in between)
  const textBetween = code.substring(closestComment.range[1], node.range![0]);
  const isDirectlyPreceding = /^\s*$/.test(textBetween);

  if (!isDirectlyPreceding) return null;

  return extractJSDocText(closestComment.value);
}

/**
 * Create a .meta() call with the description
 */
function createMetaCall(description: string): string {
  const escapedDescription = description
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
  return `.meta({ description: \`${escapedDescription}\` })`;
}

// Create the unplugin instance
export const unplugin: UnpluginInstance<PluginOptions | undefined, false> =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

// Default export following unplugin conventions
export default unplugin;
