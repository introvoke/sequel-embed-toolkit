/**
 * Recursively freezes all properties of an object and marks them as readonly using `Object.freeze()`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepFreeze = <T extends Record<string, any>>(obj: T): T => {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      typeof obj[prop] === "object" &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });

  return Object.freeze(obj);
};
