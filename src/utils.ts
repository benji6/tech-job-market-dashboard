export const defaultDict = <V>(createDefaultValue: () => V) =>
  new Proxy<Record<string, V>>(Object.create(null), {
    get: (target, key: string): V => {
      if (!Object.hasOwn(target, key)) target[key] = createDefaultValue();
      return target[key];
    },
  });
