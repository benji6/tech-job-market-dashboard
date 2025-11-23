export const defaultDict = <V>(createDefaultValue: () => V) =>
  new Proxy<Record<string, V>>(Object.create(null), {
    get: (target, key: string): V => {
      if (!Object.hasOwn(target, key)) target[key] = createDefaultValue();
      return target[key];
    },
  });

export const integerFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

export const sum = (xs: number[]): number => {
  let total = 0;
  for (const x of xs) total += x;
  return total;
};
