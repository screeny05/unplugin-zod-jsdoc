import { z } from 'zod/v4';
/**
 * Key-value mapping of settings
 */
const settingsSchema = z.record(z.string(), z.unknown()).meta({ description: `Key-value mapping of settings` }); 