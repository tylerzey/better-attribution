export const isNull = (value: unknown): value is null => Object.is(value, null);
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;
export const isNil = <T>(
  value: T | undefined | null
): value is undefined | null => isNull(value) || isUndefined(value);
export const isNotNil = <T>(value: T | undefined | null): value is T =>
  !isNil(value);
