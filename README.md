# zooduck/json-serializer

A utility class for serializing and deserializing data using the JSON API.

## Installation

### For users with an access token

Add a `.npmrc` file to your project, with the following lines:

```text
@zooduck:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_ACCESS_TOKEN
```

Install from the command line:

```node
npm install @zooduck/json-serializer@latest
```

Install via package.json:

```json
"@zooduck/json-serializer": "latest"
```

### For users without an access token

Clone or [Download](https://github.com/zooduck/json-serializer/archive/refs/heads/master.zip) the repository to your machine.

## Getting started

Copy the `json-serializer` folder to your project.

## Import

Import using a module file:

```javascript
import { JSONSerializer } from 'path/to/json-serializer/dist/index.module.js'
```

## Explanation

Given the following scary object:

```javascript
function fn1() { return a + b }
const fn2 = () => a + b
const obj = {
  fn1: fn1,
  fn2: fn2,
  fn3(a, b) {
    return a + b;
  },
  arraysWithMapsAndSets: [
    [new Map(), new Set(), [new Map([['example', new Set([1,1,2])]])]],
    [new Map(), new Set(), [
      new Map(), new Set([1,2,3,new Map(), new Set()])
    ]]
  ]
}
```

If we try to stringify this using `JSON.stringify(obj, null, 2)` we would get the following JSON output:

```javascript
{
  "arraysWithMapsAndSets": [
    [
      {},
      {},
      [
        {}
      ]
    ],
    [
      {},
      {},
      [
        {},
        {}
      ]
    ]
  ]
}
```

This is because `JSON.stringify()` converts `Map` and `Set` items to empty objects, and discards `Function` parameters completely.

The `JSONSerializer` contains `replacer` and `reviver` functions that allow for the serialization and deserialization of `Map`, `Set` and `Function` objects.

So if we stringify the same object using `JSONSerializer.stringify(obj, 2)` we get a JSON output similar to:

```javascript
{
  "fn1": {
    "isSerializedFunction": true,
    "value": "() => { return a + b }"
  },
  "fn2": {
    "isSerializedFunction": true,
    "value": "() => a + b"
  },
  "fn3": {
    "isSerializedFunction": true,
    "value": "(a, b) => {\n    return a + b;\n  }"
  },
  "arraysWithMapsAndSets": [
    [
      {
        "isSerializedMap": true,
        "entries": []
      },
      {
        "isSerializedSet": true,
        "values": []
      },
      [
        {
          "isSerializedMap": true,
          "entries": [
            [
              "example",
              {
                "isSerializedSet": true,
                "values": [
                  1,
                  2
                ]
              }
            ]
          ]
        }
      ]
    ],
    [
      {
        "isSerializedMap": true,
        "entries": []
      },
      {
        "isSerializedSet": true,
        "values": []
      },
      [
        {
          "isSerializedMap": true,
          "entries": []
        },
        {
          "isSerializedSet": true,
          "values": [
            1,
            2,
            3,
            {
              "isSerializedMap": true,
              "entries": []
            },
            {
              "isSerializedSet": true,
              "values": []
            }
          ]
        }
      ]
    ]
  ]
}
```

As you can see, the unserializable items are converted to object placeholders with serializable representations of their data, which can be later deserialized using the `JSONSerializer.reviver` reviver function.

### Using JSONSerializer

Stringify an object:

```javascript
// Simple:
JSONSerializer.stringify(obj)

// Verbose:
JSON.stringify(obj, JSONSerializer.replacer)
```

Parse a stringified object:

```javascript
const serializedObject = JSONSerializer.stringify(obj)

// Simple:
JSONSerializer.parse(serializedObject)

// Verbose
JSON.parse(serializedObject, JSONSerializer.reviver)
```
