export const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  // return keys.reduce((finalObj, key) => {
  //   if (obj && Object.hasOwnProperty.call(obj, key)) {
  //     finalObj[key] = obj[key];
  //   }
  //   return finalObj;
  // }, {} as Partial<T>);

  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};
