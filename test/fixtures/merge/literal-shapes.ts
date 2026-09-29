/** Spread */
const sSpread = z.string().meta({ ...base, cms: 1 });

/** Computed key */
const sComputed = z.string().meta({ [key]: "value" });

/** Empty literal */
const sEmpty = z.string().meta({});

/**
 * @title Tags only
 */
const sTagsOnly = z.string().meta({ cms: 1 });

// --- result ---

/** Spread */
const sSpread = z.string().meta({ description: "Spread", ...base, cms: 1 });

/** Computed key */
const sComputed = z.string().meta({ description: "Computed key", [key]: "value" });

/** Empty literal */
const sEmpty = z.string().meta({ description: "Empty literal" });

/**
 * @title Tags only
 */
const sTagsOnly = z.string().meta({ title: "Tags only", cms: 1 });
