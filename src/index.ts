import { createUnplugin, UnpluginFactory, UnpluginInstance } from "unplugin";
import oxc, {
  CallExpression,
  Comment,
  Node,
  ObjectExpression,
  ObjectProperty,
} from "oxc-parser";
import MagicString from "magic-string";
import { walk } from "oxc-walker";
import { parse, Spec } from "comment-parser";
import { genObjectFromValues } from "knitwork";

export interface PluginOptions {
  /**
   * Enable in development mode.
   * Can improve performance by disabling the transformation in development.
   * @default true
   */
  enableInDev?: boolean;

  /**
   * Merge the JSDoc into a schema that already ends in `.meta({ ... })` instead of skipping it.
   * Only the keys the object literal does not declare are inserted, at its start, so an explicit
   * key, a later spread or a computed key always wins. After a trailing `.describe()`, a `.meta()`
   * carrying every JSDoc key except `description` is appended.
   * @default false
   */
  mergeExistingMeta?: boolean;

  /**
   * Functions whose call returns a Zod schema, treated like a call rooted at `z`. An entry is
   * matched against the callee's name, `wellKnownString`, or its static member path,
   * `lib.wellKnownString`.
   * @default []
   */
  schemaFactories?: string[];
}

type Meta = Record<string, unknown>;

interface Edit {
  position: number;
  text: string;
}

export const unpluginFactory: UnpluginFactory<PluginOptions | undefined> = (
  options = {}
) => {
  const {
    enableInDev = true,
    mergeExistingMeta = false,
    schemaFactories = [],
  } = options;
  const factories = new Set(schemaFactories);

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
          // A file can build schemas through a factory without importing zod itself.
          include: [/from\s*['"]zod\/v4['"]/, ...factories],
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
          const transformations: Edit[] = [];
          // An exported declaration is reached both as a VariableDeclaration and through its
          // ExportNamedDeclaration; one expression must be edited at most once.
          const handled = new Set<number>();

          // Get all comments from the AST
          const comments = result.comments || [];

          const visit = (expression: Node | null | undefined, anchor: Node) => {
            if (
              !expression ||
              handled.has(expression.start) ||
              !isZodExpression(expression, factories)
            ) {
              return;
            }

            const jsdocComment = getJSDocCommentForNode(anchor, comments, code);
            if (!jsdocComment) return;

            handled.add(expression.start);
            const meta = jsdocToMeta(jsdocComment);
            if (!meta) return;

            const edit = planEdit(expression, meta, mergeExistingMeta, code);
            if (edit) transformations.push(edit);
          };

          // Use oxc-walker to traverse the AST
          walk(ast, {
            enter(node) {
              /**
               * Handle variable declarations
               * @example
               * /** jsdoc comment * /
               * const sConst = z.string();
               * /** jsdoc comment * /
               * let sLet = z.string();
               * /** jsdoc comment * /
               * var sVar = z.string();
               */
              if (node.type === "VariableDeclaration") {
                for (const declaration of node.declarations) {
                  visit(declaration.init, node);
                }
              }

              // Handle object properties
              if (node.type === "Property") {
                const property = node as ObjectProperty;
                visit(property.value, node);
              }

              // Handle array elements and discriminated union elements
              if (node.type === "ArrayExpression") {
                for (const element of node.elements) {
                  if (element) visit(element, element);
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
                  visit(arg, arg);
                }
              }

              // Handle export statements
              if (node.type === "ExportNamedDeclaration" && node.declaration) {
                if (node.declaration.type === "VariableDeclaration") {
                  for (const declaration of node.declaration.declarations) {
                    visit(declaration.init, node);
                  }
                }
              }
            },
          });

          // Apply transformations in reverse order to maintain correct positions
          transformations
            .sort((a, b) => b.position - a.position)
            .forEach(({ position, text }) => {
              magicString.appendRight(position, text);
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
 * Strip the wrappers that leave the runtime value untouched: parentheses, `as`, `satisfies`,
 * `<T>x` and `x!`.
 */
function unwrapExpression(node: Node): Node {
  let current: any = node;
  while (
    current.type === "ParenthesizedExpression" ||
    current.type === "TSAsExpression" ||
    current.type === "TSSatisfiesExpression" ||
    current.type === "TSTypeAssertion" ||
    current.type === "TSNonNullExpression"
  ) {
    current = current.expression;
  }
  return current;
}

/**
 * Check for `z` or a static namespace below it, like `z.iso`
 */
function isZodNamespace(node: Node): boolean {
  if (node.type === "Identifier") {
    return node.name === "z";
  }
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    isZodNamespace(node.object)
  );
}

/**
 * The dotted name of an identifier or a static member chain, like `lib.factory`
 */
function staticPath(node: Node): string | null {
  if (node.type === "Identifier") {
    return node.name;
  }
  if (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.property.type === "Identifier"
  ) {
    const object = staticPath(node.object);
    return object === null ? null : `${object}.${node.property.name}`;
  }
  return null;
}

/**
 * Check for a call to one of the configured schema factories
 */
function isFactoryCall(node: Node, factories: Set<string>): boolean {
  if (factories.size === 0 || node.type !== "CallExpression") {
    return false;
  }
  const path = staticPath(node.callee);
  return path !== null && factories.has(path);
}

/**
 * Check if a node represents a Zod expression
 */
function isZodExpression(node: Node, factories: Set<string>): boolean {
  const expression = unwrapExpression(node);
  if (expression.type !== "CallExpression") {
    return false;
  }

  if (isFactoryCall(expression, factories)) {
    return true;
  }

  const callee = expression.callee;
  if (callee.type !== "MemberExpression") {
    return false;
  }

  // Check for z.something() and z.namespace.something() patterns
  if (isZodNamespace(callee.object)) {
    return true;
  }

  // Check for chained calls like z.string().optional(), also through casts
  return isZodExpression(callee.object, factories);
}

interface MetaLink {
  name: string;
  call: CallExpression;
  /** Whether it is the outermost call of the expression, the one whose result is the schema */
  trailing: boolean;
}

// `description` is a getter in zod v4, not a method; a call to it is still left alone.
const META_METHODS = new Set(["meta", "describe", "description"]);

/**
 * Collect every .meta(), .describe() or .description() call in a Zod call chain
 */
function metaLinksOf(node: Node): MetaLink[] {
  const links: MetaLink[] = [];
  let current = unwrapExpression(node);
  let trailing = true;

  while (
    current.type === "CallExpression" &&
    current.callee.type === "MemberExpression"
  ) {
    const callee = current.callee;
    if (
      !callee.computed &&
      callee.property.type === "Identifier" &&
      META_METHODS.has(callee.property.name)
    ) {
      links.push({ name: callee.property.name, call: current, trailing });
    }
    trailing = false;
    current = unwrapExpression(callee.object);
  }

  return links;
}

/**
 * Decide how the JSDoc metadata reaches a Zod expression, or `null` to leave it untouched
 */
function planEdit(
  expression: Node,
  meta: Meta,
  mergeExistingMeta: boolean,
  code: string
): Edit | null {
  // A cast is type-only, so the schema it wraps is the one the JSDoc describes. Appending there
  // keeps the cast's type: `.meta()` returns the schema's own type.
  const position = unwrapExpression(expression).end;
  const links = metaLinksOf(expression);

  if (links.length === 0) {
    return { position, text: createMetaCall(meta) };
  }

  // Below `.optional()` and friends the meta sits on another schema node, and with several
  // calls a key could be explicit on either one.
  if (!mergeExistingMeta || links.length > 1 || !links[0].trailing) {
    return null;
  }

  const [link] = links;

  if (link.name === "describe") {
    const { description, ...rest } = meta;
    if (Object.keys(rest).length === 0) return null;
    return { position, text: createMetaCall(rest) };
  }

  if (link.name !== "meta") {
    return null;
  }

  const [argument, ...extra] = link.call.arguments;
  if (!argument || extra.length > 0 || argument.type !== "ObjectExpression") {
    return null;
  }

  return planMergeIntoLiteral(argument, meta, code);
}

/**
 * Insert the keys a `.meta({ ... })` literal lacks at its start, so everything already in the
 * literal - including spreads and computed keys - overrides them at runtime
 */
function planMergeIntoLiteral(
  literal: ObjectExpression,
  meta: Meta,
  code: string
): Edit | null {
  const present = new Set<string>();
  for (const property of literal.properties) {
    if (property.type !== "Property" || property.computed) continue;
    if (property.key.type === "Identifier") present.add(property.key.name);
    if (property.key.type === "Literal")
      present.add(String(property.key.value));
  }

  const missing = Object.fromEntries(
    Object.entries(meta).filter(
      ([key, value]) =>
        !present.has(key) && !(key === "description" && value === "")
    )
  );
  if (Object.keys(missing).length === 0) return null;

  const keys = renderObject(missing).slice(1, -1).trim();
  const [first] = literal.properties;

  if (!first) {
    const inside = code.slice(literal.start + 1, literal.end - 1);
    return {
      position: literal.start + 1,
      text: ` ${keys}${inside === "" ? " " : ""}`,
    };
  }

  const lineStart = code.lastIndexOf("\n", first.start - 1) + 1;
  const indent = code.slice(lineStart, first.start);
  const ownLine = lineStart > literal.start && /^\s*$/.test(indent);

  return {
    position: first.start,
    text: `${keys}${ownLine ? `,\n${indent}` : ", "}`,
  };
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

  // Check if the comment is directly before this node (with only whitespace and line comments,
  // such as an eslint directive, in between)
  const textBetween = code
    .substring(closestComment.end, node.start)
    .replace(/\/\/[^\n]*/g, "");
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
 * Collect the metadata a JSDoc comment describes
 */
function jsdocToMeta(description: string): Meta | null {
  const parsed = parse(description).at(0);
  if (!parsed) {
    return null;
  }

  const meta: Meta = {
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

  return meta;
}

/**
 * Render metadata as a single-line object literal
 */
function renderObject(meta: Meta): string {
  return genObjectFromValues(meta).replace(/\n/g, " ").replace(/\s+/g, " ");
}

/**
 * Create a .meta() call with the description
 */
function createMetaCall(meta: Meta): string {
  return `.meta(${renderObject(meta)})`;
}

// Create the unplugin instance
export const unplugin: UnpluginInstance<PluginOptions | undefined, false> =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

// Default export following unplugin conventions
export default unplugin;
