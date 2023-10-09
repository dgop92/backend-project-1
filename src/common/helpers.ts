/**
 * Create a new object with all undefined and null values removed.
 */
export function removeUndefinedAndNull<T extends Record<string, unknown>>(
  obj: T
): T {
  const newObj: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      newObj[key] = value;
    }
  });
  return newObj;
}
