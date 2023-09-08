export const prefixObject = (prefix: string, obj: Record<string, unknown>) => {
  return Object.entries(obj).reduce(
    (acc, [key, val]) => {
      acc[`${prefix}${key}`] = val;

      return acc;
    },
    {} as Record<string, any>,
  );
};
