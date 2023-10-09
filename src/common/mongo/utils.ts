export function getMongoProjection(options?: {
  [key: string]: boolean | undefined;
}): {
  [key: string]: number;
} {
  const projection: { [key: string]: number } = {};
  if (options) {
    for (const key in options) {
      if (options[key] === undefined || options[key] === false) {
        projection[key] = 0;
      }
    }
  }
  return projection;
}
