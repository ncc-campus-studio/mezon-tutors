export function parseEnum<T extends string>(val: string, validList: readonly T[], defaultVal: T): T {
  return validList.includes(val as T) ? (val as T) : defaultVal;
}
