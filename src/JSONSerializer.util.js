/**
 * @typedef {import('./typedef.js')}
 */

/**
 * A utility class for serializing and deserializing data using the JSON API.
 *
 * Supports Map, Set and Function objects (including heavily nested Map and Set objects).
 *
 * @example
 * // Stringify an object with formatting (2 space indentation):
 * JSON.stringify(obj, JSONSerializer.replacer, 2)
 * // Or:
 * JSONSerializer.stringify(obj, 2) // Note the "space" parameter is the second argument, since the replacer function argument is not applicable.
 *
 * @example
 * // Clone an object:
 * JSON.parse(JSON.stringify(obj, JSONSerializer.replacer), JSONSerializer.reviver)
 * // Or:
 * JSONSerializer.parse(JSONSerializer.stringify(obj))
 */
class JSONSerializer {
  static #uuid = crypto.randomUUID();
  static #IS_SERIALIZED_FUNCTION_KEY = 'isSerializedFunction' + this.#uuid;
  static #IS_SERIALIZED_MAP_KEY = 'isSerializedMap' + this.#uuid;
  static #IS_SERIALIZED_SET_KEY = 'isSerializedSet' + this.#uuid;
  /**
   * @method
   * @static
   * @type {JSONReplacerCallback}
   * @returns {*}
   */
  static replacer(_key, value) {
    if (value instanceof Map) {
      return JSONSerializer.#serializeMap(value);
    }
    if (value instanceof Set) {
      return JSONSerializer.#serializeSet(value);
    }
    if (value instanceof Function) {
      return JSONSerializer.#serializeFunction(value);
    }
    return value;
  }
  /**
   * @method
   * @static
   * @type {JSONReviverCallback}
   * @returns {*}
   */
  static reviver(_key, value) {
    if (value?.[JSONSerializer.#IS_SERIALIZED_FUNCTION_KEY]) {
      return JSONSerializer.#deserializeFunction(value);
    }
    if (value?.[JSONSerializer.#IS_SERIALIZED_MAP_KEY]) {
      return JSONSerializer.#deserializeMap(value);
    }
    if (value?.[JSONSerializer.#IS_SERIALIZED_SET_KEY]) {
      return JSONSerializer.#deserializeSet(value);
    }
    return value;
  }
  /**
   * @method
   * @static
   * @param {*} value
   * @param {number} [space]
   * @returns {string}
   */
  static stringify(value, space) {
    return JSON.stringify(value, JSONSerializer.replacer, space);
  }
  /**
   * @method
   * @static
   * @param {string} text
   * @returns {*}
   */
  static parse(text) {
    return JSON.parse(text, JSONSerializer.reviver);
  }
  /**
   * @method
   * @private
   * @static
   * @param {Function} fn
   * @returns {{isSerializedFunction: boolean, value: string}}
   */
  static #serializeFunction(fn) {
    const functionString = fn.toString().match(/\([\w\W]+/)[0];
    const isArrowFunction = /^\([^\)]*\) *=>/.test(functionString);
    return {
      [this.#IS_SERIALIZED_FUNCTION_KEY]: true,
      value: isArrowFunction ? functionString : functionString.replace(/\) ?/, ') => ')
    };
  }
  /**
   * @method
   * @private
   * @static
   * @param {string}
   * @returns {Function}
   */
  static #deserializeFunction(serializedFunction) {
    return eval(serializedFunction.value);
  }
  /**
   * @method
   * @private
   * @static
   * @param {Map} map
   * @returns {{isSerializedMap: boolean, entries: Array.<string, *>[]}}
   */
  static #serializeMap(map) {
    const serializedMap = new Map();
    map.forEach((value, key) => {
      if (value instanceof Map) {
        serializedMap.set(key, this.#serializeMap(value));
        return this.#serializeMap(serializedMap);
      }
      serializedMap.set(key, value);
    });
    return {
      [this.#IS_SERIALIZED_MAP_KEY]: true,
      entries: Array.from(serializedMap.entries())
    };
  }
  /**
   * @method
   * @private
   * @static
   * @param {{isSerializedMap: boolean, entries: Array.<string, *>[]}} serializedMap
   * @returns {Map}
   */
  static #deserializeMap(serializedMap) {
    const deserializedMap = new Map();
    serializedMap.entries.forEach(([key, value]) => {
      deserializedMap.set(key, value);
    });
    return new Map(deserializedMap.entries());
  }
  /**
   * @method
   * @private
   * @static
   * @param {Set} set
   * @returns {{isSerializedSet: boolean, values: *[]}}
   */
  static #serializeSet(set) {
    const serializedSet = new Set();
    set.forEach((value) => {
      if (value instanceof Set) {
        serializedSet.add(this.#serializeSet(value));
        return this.#serializeSet(serializedSet);
      }
      serializedSet.add(value);
    });
    return {
      [this.#IS_SERIALIZED_SET_KEY]: true,
      values: Array.from(serializedSet.values())
    };
  }
  /**
   * @method
   * @private
   * @static
   * @param {{isSerializedSet: boolean, values: *[]}} serializedSet
   * @returns {Set}
   */
  static #deserializeSet(serializedSet) {
    const deserializedSet = new Set();
    serializedSet.values.forEach((value) => {
      deserializedSet.add(value);
    });
    return new Set(deserializedSet.values());
  }
}

export { JSONSerializer };
