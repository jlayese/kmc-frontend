/**
 * Check if provided parameter is plain object
 * @param item
 * @returns boolean
 */
export const isObject = (item: unknown): item is Record<string, unknown> =>
  item !== null && typeof item === 'object' && item.constructor === Object;
