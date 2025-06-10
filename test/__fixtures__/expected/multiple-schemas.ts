import { z } from 'zod/v4';
/**
 * First schema
 */
const first = z.string().meta({ description: `First schema` });

/**
 * Second schema
 */
const second = z.number().meta({ description: `Second schema` }); 