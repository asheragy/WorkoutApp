type Item<T> = {label: string; value: T};

// Works for numeric enums (filter out reverse numeric keys)
export function enumToItemsNumeric<E extends Record<string, string | number>>(
  e: E,
  labelize: (k: string, v: number) => string = k => k,
): Item<number>[] {
  return Object.keys(e)
    .filter(k => isNaN(Number(k))) // keep only the named keys
    .map(k => ({label: labelize(k, e[k] as number), value: e[k] as number}));
}
