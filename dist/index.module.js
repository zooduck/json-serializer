/* ------------------------------- */
/* @zooduck/json-serializer v0.0.1 */
/* ------------------------------- */
class JSONSerializer {
  static #uuid = crypto.randomUUID();
  static #IS_SERIALIZED_FUNCTION_KEY = 'isSerializedFunction' + this.#uuid;
  static #IS_SERIALIZED_MAP_KEY = 'isSerializedMap' + this.#uuid;
  static #IS_SERIALIZED_SET_KEY = 'isSerializedSet' + this.#uuid;
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
  static stringify(value, space) {
    return JSON.stringify(value, JSONSerializer.replacer, space);
  }
  static parse(text) {
    return JSON.parse(text, JSONSerializer.reviver);
  }
  static #serializeFunction(fn) {
    const functionString = fn.toString().match(/\([\w\W]+/)[0];
    const isArrowFunction = /^\([^\)]*\) *=>/.test(functionString);
    return {
      [this.#IS_SERIALIZED_FUNCTION_KEY]: true,
      value: isArrowFunction ? functionString : functionString.replace(/\) ?/, ') => ')
    };
  }
  static #deserializeFunction(serializedFunction) {
    return eval(serializedFunction.value);
  }
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
  static #deserializeMap(serializedMap) {
    const deserializedMap = new Map();
    serializedMap.entries.forEach(([key, value]) => {
      deserializedMap.set(key, value);
    });
    return new Map(deserializedMap.entries());
  }
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
  static #deserializeSet(serializedSet) {
    const deserializedSet = new Set();
    serializedSet.values.forEach((value) => {
      deserializedSet.add(value);
    });
    return new Set(deserializedSet.values());
  }
}
export { JSONSerializer };