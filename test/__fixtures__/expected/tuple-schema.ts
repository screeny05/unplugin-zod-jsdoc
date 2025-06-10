import { z } from 'zod/v4';
/**
 * Coordinate pair [x, y]
 */
const coordinateSchema = z.tuple([z.number(), z.number()]).meta({ description: `Coordinate pair [x, y]` }); 