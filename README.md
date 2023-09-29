# MemoryDB

[![npm](https://img.shields.io/npm/v/@plaindb/memorydb?style=flat&logo=npm)](https://www.npmjs.com/package/@plaindb/memorydb)
[![pipeline](https://gitlab.com/frenware/framework/plaindb/memorydb/badges/master/pipeline.svg)](https://gitlab.com/frenware/framework/plaindb/memorydb/-/pipelines)
[![license](https://img.shields.io/npm/l/@plaindb/memorydb)](https://gitlab.com/frenware/framework/plaindb/memorydb/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/@plaindb/memorydb)](https://www.npmjs.com/package/@plaindb/memorydb) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/frenware/framework/plaindb/memorydb)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/memorydb)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

An in-memory database that's designed for high-performance data storage and retrieval. Support for sorted data structures and batch operations that enable sorted and efficient data handling operations. You can perform CRUD operations, iterate through sorted data, and much more.

## Features

- In-memory sorted data storage
- Event Emitters
- Built-in batch operations
- Supports key and value encoding
- Event-driven architecture
- Streaming support

## Installation

Install the package with:

```bash
npm install @plaindb/memorydb
```

## Usage

### Import the Package

```js
import MemoryDB from '@plaindb/memorydb'
```
or
```js
const MemoryDB = require('@plaindb/memorydb')
```

### Create a New MemoryDB Instance

```js
const db = new MemoryDB()
```

### Insert a Key-Value Pair

```js
await db.put('key', 'value')
```

### Retrieve a Value by Key

```js
const value = await db.get('key')
```

### Delete a Key

```js
await db.del('key')
```

### Batch Operations

```js
const batch = db.batch()
batch.put('key1', 'value1')
batch.put('key2', 'value2')
batch.del('key3')
await batch.build()
```

### Sub Databases

You can also create sub-databases.

```js
const subDb = db.sub('subDbPath')
```

## Example

```js
const db = new MemoryDB()
// put, get and del operations will wait for the instance to be ready but you can call it explicitly
await db.isReady()

// put key-value pair
await db.put('key1', 'value1')

// get value by key
console.log(await db.get('key1'))  // Output: value1

// delete key
await db.del('key1')

// batch operations
await db.batch([
  { type: 'put', key: 'key1', value: 'value1' },
  { type: 'put', key: 'key2', value: 'value2' }
])
```

## Documentation

- [API Reference](/docs/api.md)

### Class `MemoryDB`

#### `async put(key, value)`

Inserts a new key-value pair or updates the value if the key already exists.

#### `async get(key)`

Retrieves the value for the given key. Returns `null` if the key does not exist.

#### `async del(key)`

Deletes a key and its corresponding value from the database.

#### `sub(path, opts)`

Returns a subtree.

#### `iterator(opts)`

Iterates through all the key-value pairs.

#### `listAll(opts)`

Prints all key-value pairs.

#### `batch(ops)`

Batch execute multiple operations.

#### `isReady()`

Returns a promise that resolves when the database is ready.

#### `collect(type, opts)`

Collects keys or values based on the given options.

## Tests

In order to run the test suite, simply clone the repository and install its dependencies:

```bash
git clone https://gitlab.com/frenware/framework/plaindb/memorydb.git
cd basd
npm install
```

To run the tests:

```bash
npm test
```

## Contributing

Thank you! Please see our [contributing guidelines](/docs/contributing.md) for details.

## Donations

If you find this project useful and want to help support further development, please send us some coin. We greatly appreciate any and all contributions. Thank you!

**Bitcoin (BTC):**
```
1JUb1yNFH6wjGekRUW6Dfgyg4J4h6wKKdF
```

**Monero (XMR):**
```
46uV2fMZT3EWkBrGUgszJCcbqFqEvqrB4bZBJwsbx7yA8e2WBakXzJSUK8aqT4GoqERzbg4oKT2SiPeCgjzVH6VpSQ5y7KQ
```

## License

basd is [MIT licensed](https://gitlab.com/frenware/framework/plaindb/memorydb/-/blob/master/LICENSE).

