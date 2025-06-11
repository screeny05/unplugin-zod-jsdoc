/**
 * Single const
 */
export const sConst = z.string();

/**
 * Multiple consts
 */
export const sConst2 = z.string(), sConst3 = z.string();

/**
 * Single let
 */
export let sLet = z.string();

/**
 * Multiple lets
 */
export let sLet2 = z.string(), sLet3 = z.string();

/**
 * Single var
 */
export var sVar = z.string();

/**
 * Multiple vars
 */
export var sVar2 = z.string(), sVar3 = z.string();

// --- result ---

/**
 * Single const
 */
export const sConst = z.string().meta({ description: "Single const" });

/**
 * Multiple consts
 */
export const sConst2 = z.string().meta({ description: "Multiple consts" }), sConst3 = z.string().meta({ description: "Multiple consts" });

/**
 * Single let
 */
export let sLet = z.string().meta({ description: "Single let" });

/**
 * Multiple lets
 */
export let sLet2 = z.string().meta({ description: "Multiple lets" }), sLet3 = z.string().meta({ description: "Multiple lets" });

/**
 * Single var
 */
export var sVar = z.string().meta({ description: "Single var" });

/**
 * Multiple vars
 */
export var sVar2 = z.string().meta({ description: "Multiple vars" }), sVar3 = z.string().meta({ description: "Multiple vars" });