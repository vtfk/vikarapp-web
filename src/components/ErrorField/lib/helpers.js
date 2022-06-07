  /**
   * Takes in an object and ordered lists of how it's properties should be ordered
   * @param {object} obj The object containing the keys/properties
   * @param {String[]} startProperties A string array of what properties it should start with
   * @param {String[]} endProperties A string array of what keys/properties it should end with
   * @returns {object} A copy of the provided object with the keys in order
   */
  export function createObjectWithOrderedKeys (obj, startProperties = [], endProperties = []) {
    // Input validation
    if (!obj || typeof obj !== 'object') { throw new Error('The provided object is not of type object'); }
    if (!Array.isArray(startProperties)) { throw new Error('startProperties is not of type Array'); }
    if (!Array.isArray(endProperties)) { throw new Error('endProperties is not of type Array'); }

    // Find all keys that are not matched
    const unmatchedKeys = Object.keys(obj).filter((key) => !startProperties.includes(key) && !endProperties.includes(key));

    // Combine all keys in order
    const orderedKeys = startProperties.concat(unmatchedKeys).concat(endProperties);

    // Construct a new object with the properties in order
    const newObj = {};
    orderedKeys.forEach((key) => {
      if (obj[key]) newObj[key] = obj[key];
    })

    // Return the new object
    return newObj;
  }