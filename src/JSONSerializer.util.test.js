/**
 * @jest-environment jsdom
 */

import './__mocks__/crypto.mock.js';
import { jest } from '@jest/globals';
import { JSONSerializer } from './JSONSerializer.util.js';

describe('JSONSerializer', () => {
  describe('methods', () => {
    it('should serialize Maps', () => {
      const obj = {
        map: new Map([['abc', 123]])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Sets', () => {
      const obj = {
        set: new Set([1,2,1,4])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Functions', () => {
      function fn1(a, b) { return a + b + 1; }
      const fn2 = (a, b) => a + b + 2;
      const obj = {
        fn1: fn1,
        fn2: fn2,
        fn3: (a, b) => { return a + b + 3; },
        fn4(a, b) { return a + b + 4; }
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized.fn1(1,2)).toBe(4);
      expect(deserialized.fn2(1,2)).toBe(5);
      expect(deserialized.fn3(1,2)).toBe(6);
      expect(deserializedVerbose.fn4(1,2)).toBe(7);
      expect(deserializedVerbose.fn1(1,2)).toBe(4);
      expect(deserializedVerbose.fn2(1,2)).toBe(5);
      expect(deserializedVerbose.fn3(1,2)).toBe(6);
      expect(deserializedVerbose.fn4(1,2)).toBe(7);
    });

    it('should serialize Maps within Maps', () => {
      const m = new Map();
      m.set('a', new Map([['b', new Map([['c', 1]])]]));
      const obj = {
        nestedMaps: new Map([['abc', new Map([['def', 123]])], ['xyz', new Map([['def', 234], ['abc', new Map([['xyz', 123]])]])]])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Sets within Sets', () => {
      const obj = {
        nestedSets: new Set([1,2,1,3,new Set([1,1,1,new Set([2,2,2])])])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Maps within Sets', () => {
      const obj = {
        set: new Set([1,2,1,new Map([['abc', 123]]),new Set([new Map([['abc', 123]]), {map: new Map()}])])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Sets within Maps', () => {
      const obj = {
        map: new Map([['abc', new Set([1,1,2])], ['def', new Map([['abc', new Set([1,1,2])]])]])
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Maps within Arrays', () => {
      const obj = {
        mapsInArrays: [
          new Map([['abc', 123]]),
          {
            maps: [
              new Map([['abc', 123], ['xyz', new Map([['abc', 123]])]]),
              [
                1, 2, 3, new Map([['abc', 123]]), 4, 5
              ]
            ]
          }
        ]
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });

    it('should serialize Sets within Arrays', () => {
      const obj = {
        setsInArrays: [
          new Set([1,1,1]),
          {
            sets: [
              new Set([1,1,1, new Set([1,1,1])]),
              [
                1, 2, 3, new Set([1,1,1]), 4, 5
              ]
            ]
          }
        ]
      };
      const serialized = JSONSerializer.stringify(obj);
      const deserialized = JSONSerializer.parse(serialized);
      const serializedVerbose = JSON.stringify(obj, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(typeof serialized).toBe('string');
      expect(typeof serializedVerbose).toBe('string');
      expect(deserialized).toEqual(obj);
      expect(deserializedVerbose).toEqual(obj);
    });
  });

  describe('eval', () => {
    beforeAll(() => {
      Object.defineProperty(global, 'maliciousScript', {
        value: jest.fn(),
        isWritable: true
      });
    });

    it('should include protection against script injection when serializing / deserializing functions', () => {
      const sneakyObject = {
        malicious: {
          isSerializedFunction: true,
          value: 'window.maliciousScript()'
        }
      };
      expect(global.maliciousScript).toHaveBeenCalledTimes(0);
      const serialized = JSONSerializer.stringify(sneakyObject);
      const deserialized = JSONSerializer.parse(serialized);
      expect(global.maliciousScript).toHaveBeenCalledTimes(0);
    });

    it('should include protection against script injection when serializing / deserializing functions (using verbose way)', () => {
      const sneakyObject = {
        malicious: {
          isSerializedFunction: true,
          value: 'window.maliciousScript()'
        }
      };
      expect(global.maliciousScript).toHaveBeenCalledTimes(0);
      const serializedVerbose = JSON.stringify(sneakyObject, JSONSerializer.replacer);
      const deserializedVerbose = JSON.parse(serializedVerbose, JSONSerializer.reviver);
      expect(global.maliciousScript).toHaveBeenCalledTimes(0);
    });
  });
});
