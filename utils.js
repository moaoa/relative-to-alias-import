const flagRegex = /--.+=.+/;

/**
@typedef {Object} FlagsObject
@property {string} path - The path property of the object.
@property {string} alias - The alias property of the object.
*/

/**
 *
 * @param {string[]} args
 * @returns {FlagsObject}
 */
export const parseFlags = (args) => {
  return args
    .filter((item) => flagRegex.test(item))
    .reduce((prev, current) => {
      const [key, value] = current.split("=");
      const prop = key.replaceAll("-", "");
      prev[prop] = value;
      return prev;
    }, {});
};

/**
 *
 * @param {string[]} args
 * @returns {string[]}
 */
export const parseExtensions = (args) => {
  return args.filter((item) => !flagRegex.test(item));
};
