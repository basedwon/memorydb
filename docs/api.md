## Classes

<dl>
<dt><a href="#BatchExecutor">BatchExecutor</a></dt>
<dd><p>Class responsible for executing a batch of operations atomically.</p>
</dd>
<dt><a href="#Batch">Batch</a></dt>
<dd><p>Class responsible for building a batch of operations.</p>
</dd>
<dt><a href="#MemoryDB">MemoryDB</a></dt>
<dd><p>In-memory database extending SortedTree and providing eventing.</p>
</dd>
<dt><a href="#SortedTree">SortedTree</a></dt>
<dd><p>Nested and Sorted structure, extending functionalities from Nested and Storage mixins.</p>
</dd>
<dt><a href="#Node">Node</a></dt>
<dd><p>Represents a Node in a doubly linked list.</p>
</dd>
<dt><a href="#Sorted">Sorted</a></dt>
<dd><p>Sorted doubly linked list with Map based indexing.</p>
</dd>
</dl>

<a name="BatchExecutor"></a>

## BatchExecutor
Class responsible for executing a batch of operations atomically.

**Kind**: global class  

* [BatchExecutor](#BatchExecutor)
    * [new BatchExecutor(storage, performingUndo)](#new_BatchExecutor_new)
    * _instance_
        * [.execute(ops)](#BatchExecutor+execute) ⇒ <code>Promise</code>
        * [.createUndoOps(ops)](#BatchExecutor+createUndoOps) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.getDb([path])](#BatchExecutor+getDb) ⇒ <code>Storage</code>
        * [.buildPromises(ops)](#BatchExecutor+buildPromises) ⇒ <code>Array.&lt;Promise&gt;</code>
        * [.createUndoOp(operation)](#BatchExecutor+createUndoOp) ⇒ <code>Promise.&lt;Object&gt;</code>
    * _static_
        * [.execute(storage, ops)](#BatchExecutor.execute) ⇒ <code>Promise</code>

<a name="new_BatchExecutor_new"></a>

### new BatchExecutor(storage, performingUndo)
Creates a BatchExecutor instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| storage | <code>Storage</code> |  | The storage instance where operations are performed. |
| performingUndo | <code>boolean</code> | <code>false</code> | Flag indicating if undo operations should be performed. |

<a name="BatchExecutor+execute"></a>

### batchExecutor.execute(ops) ⇒ <code>Promise</code>
Executes the given operations atomically.

**Kind**: instance method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Promise</code> - Resolves when all operations have been executed.  

| Param | Type | Description |
| --- | --- | --- |
| ops | <code>Array</code> | Array of operations to execute. |

<a name="BatchExecutor+createUndoOps"></a>

### batchExecutor.createUndoOps(ops) ⇒ <code>Promise.&lt;Array&gt;</code>
Creates undo operations for the given array of operations.

**Kind**: instance method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Resolves with an array of undo operations.  

| Param | Type | Description |
| --- | --- | --- |
| ops | <code>Array</code> | The operations for which to create undo operations. |

<a name="BatchExecutor+getDb"></a>

### batchExecutor.getDb([path]) ⇒ <code>Storage</code>
Gets a database instance based on a given path.

**Kind**: instance method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Storage</code> - The database instance.  

| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | The sub-path for the database. |

<a name="BatchExecutor+buildPromises"></a>

### batchExecutor.buildPromises(ops) ⇒ <code>Array.&lt;Promise&gt;</code>
Builds an array of promises for the given operations.

**Kind**: instance method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Array.&lt;Promise&gt;</code> - An array of promises representing the operations.  

| Param | Type | Description |
| --- | --- | --- |
| ops | <code>Array</code> | The operations for which to create promises. |

<a name="BatchExecutor+createUndoOp"></a>

### batchExecutor.createUndoOp(operation) ⇒ <code>Promise.&lt;Object&gt;</code>
Creates an undo operation for a single operation.

**Kind**: instance method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Resolves with the undo operation.  

| Param | Type | Description |
| --- | --- | --- |
| operation | <code>Object</code> | The operation for which to create an undo operation. |

<a name="BatchExecutor.execute"></a>

### BatchExecutor.execute(storage, ops) ⇒ <code>Promise</code>
Executes batch operations statically.

**Kind**: static method of [<code>BatchExecutor</code>](#BatchExecutor)  
**Returns**: <code>Promise</code> - Resolves when all operations have been executed.  

| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | The storage instance. |
| ops | <code>Array</code> | Array of operations to execute. |

<a name="Batch"></a>

## Batch
Class responsible for building a batch of operations.

**Kind**: global class  

* [Batch](#Batch)
    * [new Batch(storage)](#new_Batch_new)
    * _instance_
        * [.put(key, value, [sub])](#Batch+put) ⇒ [<code>Batch</code>](#Batch)
        * [.del(key, [sub])](#Batch+del) ⇒ [<code>Batch</code>](#Batch)
        * [.build()](#Batch+build) ⇒ <code>Array</code>
        * [.exec()](#Batch+exec) ⇒ <code>Promise</code>
    * _static_
        * [.execute(storage, arr)](#Batch.execute) ⇒ <code>Promise</code>

<a name="new_Batch_new"></a>

### new Batch(storage)
Creates a Batch instance.


| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | The storage instance where operations are performed. |

<a name="Batch+put"></a>

### batch.put(key, value, [sub]) ⇒ [<code>Batch</code>](#Batch)
Adds a put operation to the batch.

**Kind**: instance method of [<code>Batch</code>](#Batch)  
**Returns**: [<code>Batch</code>](#Batch) - Returns the current Batch instance.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key for the operation. |
| value | <code>any</code> | The value for the operation. |
| [sub] | <code>string</code> | Optional sub-path. |

<a name="Batch+del"></a>

### batch.del(key, [sub]) ⇒ [<code>Batch</code>](#Batch)
Adds a delete operation to the batch.

**Kind**: instance method of [<code>Batch</code>](#Batch)  
**Returns**: [<code>Batch</code>](#Batch) - Returns the current Batch instance.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key for the operation. |
| [sub] | <code>string</code> | Optional sub-path. |

<a name="Batch+build"></a>

### batch.build() ⇒ <code>Array</code>
Builds the batch operations.

**Kind**: instance method of [<code>Batch</code>](#Batch)  
**Returns**: <code>Array</code> - Array of batch operations.  
<a name="Batch+exec"></a>

### batch.exec() ⇒ <code>Promise</code>
Executes the batch operations atomically.

**Kind**: instance method of [<code>Batch</code>](#Batch)  
**Returns**: <code>Promise</code> - Resolves when all operations have been executed.  
<a name="Batch.execute"></a>

### Batch.execute(storage, arr) ⇒ <code>Promise</code>
Executes an array of operations atomically.

**Kind**: static method of [<code>Batch</code>](#Batch)  
**Returns**: <code>Promise</code> - Resolves when all operations have been executed.  

| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | The storage instance. |
| arr | <code>Array</code> | Array of operations to execute. |

<a name="MemoryDB"></a>

## MemoryDB
In-memory database extending SortedTree and providing eventing.

**Kind**: global class  

* [MemoryDB](#MemoryDB)
    * [new MemoryDB(opts, ...args)](#new_MemoryDB_new)
    * _instance_
        * [.isReady()](#MemoryDB+isReady) ⇒ <code>Promise</code>
        * [.put(key, value)](#MemoryDB+put) ⇒ <code>Promise</code>
        * [.get(key)](#MemoryDB+get) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.del(key)](#MemoryDB+del) ⇒ <code>Promise</code>
        * [.setOpts(opts)](#MemoryDB+setOpts) ⇒ [<code>MemoryDB</code>](#MemoryDB)
        * [.collect(type, opts)](#MemoryDB+collect) ⇒ <code>Promise.&lt;Array&gt;</code>
        * [.batch(ops)](#MemoryDB+batch) ⇒ <code>Promise</code> \| [<code>Batch</code>](#Batch)
    * _static_
        * [.parseOptions(opts, defaultOpts)](#MemoryDB.parseOptions) ⇒ <code>object</code>

<a name="new_MemoryDB_new"></a>

### new MemoryDB(opts, ...args)
Creates a MemoryDB instance.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the MemoryDB. |
| ...args | <code>any</code> | Additional arguments. |

<a name="MemoryDB+isReady"></a>

### memoryDB.isReady() ⇒ <code>Promise</code>
Checks if the database is ready.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise</code> - Resolves when the database is ready.  
<a name="MemoryDB+put"></a>

### memoryDB.put(key, value) ⇒ <code>Promise</code>
Puts a key-value pair into the database and emits a 'put' event.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise</code> - Resolves when the put operation is complete.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to store. |
| value | <code>any</code> | The value to store. |

<a name="MemoryDB+get"></a>

### memoryDB.get(key) ⇒ <code>Promise.&lt;any&gt;</code>
Retrieves a value associated with a key from the database.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise.&lt;any&gt;</code> - The associated value.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to retrieve. |

<a name="MemoryDB+del"></a>

### memoryDB.del(key) ⇒ <code>Promise</code>
Deletes a key-value pair from the database and emits a 'del' event.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise</code> - Resolves when the delete operation is complete.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to delete. |

<a name="MemoryDB+setOpts"></a>

### memoryDB.setOpts(opts) ⇒ [<code>MemoryDB</code>](#MemoryDB)
Sets additional options for the database.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: [<code>MemoryDB</code>](#MemoryDB) - The updated MemoryDB instance.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Additional options. |

<a name="MemoryDB+collect"></a>

### memoryDB.collect(type, opts) ⇒ <code>Promise.&lt;Array&gt;</code>
Collects key-value pairs based on the provided type and options.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - An array of collected data.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> \| <code>boolean</code> \| <code>object</code> | The type of data to collect ('key', 'value', or 'read'). |
| opts | <code>object</code> | Options for collecting data. |

<a name="MemoryDB+batch"></a>

### memoryDB.batch(ops) ⇒ <code>Promise</code> \| [<code>Batch</code>](#Batch)
Creates or executes a batch operation.

**Kind**: instance method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>Promise</code> \| [<code>Batch</code>](#Batch) - Returns a Promise if operations are provided, otherwise returns a new Batch instance.  

| Param | Type | Description |
| --- | --- | --- |
| ops | <code>Array</code> | An array of batch operations. |

<a name="MemoryDB.parseOptions"></a>

### MemoryDB.parseOptions(opts, defaultOpts) ⇒ <code>object</code>
Parses the given options.

**Kind**: static method of [<code>MemoryDB</code>](#MemoryDB)  
**Returns**: <code>object</code> - Parsed options.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | The options to parse. |
| defaultOpts | <code>object</code> | Default options. |

<a name="SortedTree"></a>

## SortedTree
Nested and Sorted structure, extending functionalities from Nested and Storage mixins.

**Kind**: global class  

* [SortedTree](#SortedTree)
    * [new SortedTree(opts, ...args)](#new_SortedTree_new)
    * [._keyEncode(key)](#SortedTree+_keyEncode) ⇒ <code>any</code>
    * [._valueEncode(value)](#SortedTree+_valueEncode) ⇒ <code>any</code>
    * [._keyDecode(key)](#SortedTree+_keyDecode) ⇒ <code>any</code>
    * [._valueDecode(value)](#SortedTree+_valueDecode) ⇒ <code>any</code>
    * [.put(key, value)](#SortedTree+put)
    * [.get(key)](#SortedTree+get) ⇒ <code>any</code>
    * [.del(key)](#SortedTree+del)
    * [.sub(path, opts)](#SortedTree+sub) ⇒ [<code>SortedTree</code>](#SortedTree)
    * [.iterator(opts)](#SortedTree+iterator)
    * [.listAll(opts)](#SortedTree+listAll)

<a name="new_SortedTree_new"></a>

### new SortedTree(opts, ...args)
Creates a SortedTree instance.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the SortedTree. |
| ...args | <code>any</code> | Additional arguments. |

<a name="SortedTree+_keyEncode"></a>

### sortedTree.\_keyEncode(key) ⇒ <code>any</code>
Encodes the key.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: <code>any</code> - - The encoded key.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to be encoded. |

<a name="SortedTree+_valueEncode"></a>

### sortedTree.\_valueEncode(value) ⇒ <code>any</code>
Encodes the value.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: <code>any</code> - - The encoded value.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to be encoded. |

<a name="SortedTree+_keyDecode"></a>

### sortedTree.\_keyDecode(key) ⇒ <code>any</code>
Decodes the key.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: <code>any</code> - - The decoded key.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to be decoded. |

<a name="SortedTree+_valueDecode"></a>

### sortedTree.\_valueDecode(value) ⇒ <code>any</code>
Decodes the value.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: <code>any</code> - - The decoded value.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to be decoded. |

<a name="SortedTree+put"></a>

### sortedTree.put(key, value)
Inserts or updates a key-value pair.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to insert or update. |
| value | <code>any</code> | The value to insert or update. |

<a name="SortedTree+get"></a>

### sortedTree.get(key) ⇒ <code>any</code>
Retrieves a value by its key.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: <code>any</code> - - The retrieved value, or null if the key doesn't exist.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key for which to retrieve the value. |

<a name="SortedTree+del"></a>

### sortedTree.del(key)
Deletes a key-value pair by its key.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to delete. |

<a name="SortedTree+sub"></a>

### sortedTree.sub(path, opts) ⇒ [<code>SortedTree</code>](#SortedTree)
Creates a sub SortedTree.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  
**Returns**: [<code>SortedTree</code>](#SortedTree) - - The sub SortedTree.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>array</code> | The path for the sub SortedTree. |
| opts | <code>object</code> | Additional options. |

<a name="SortedTree+iterator"></a>

### sortedTree.iterator(opts)
An iterator over the SortedTree.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Iterator options. |

<a name="SortedTree+listAll"></a>

### sortedTree.listAll(opts)
Lists all key-value pairs.

**Kind**: instance method of [<code>SortedTree</code>](#SortedTree)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Additional options for listing. |

<a name="Node"></a>

## Node
Represents a Node in a doubly linked list.

**Kind**: global class  
<a name="new_Node_new"></a>

### new Node(key, value)
Creates a new Node instance.


| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key associated with the node. |
| value | <code>any</code> | The value associated with the node. |

<a name="Sorted"></a>

## Sorted
Sorted doubly linked list with Map based indexing.

**Kind**: global class  

* [Sorted](#Sorted)
    * [new Sorted(opts)](#new_Sorted_new)
    * [.put(key, value)](#Sorted+put)
    * [.get(key)](#Sorted+get) ⇒ <code>any</code> \| <code>null</code>
    * [.del(key)](#Sorted+del)
    * [.iterator(opts)](#Sorted+iterator)
    * [.createReadStream(opts, mode)](#Sorted+createReadStream) ⇒ <code>Readable</code>
    * [.createKeyStream(opts)](#Sorted+createKeyStream) ⇒ <code>Readable</code>
    * [.createValueStream(opts)](#Sorted+createValueStream) ⇒ <code>Readable</code>
    * [.listAll()](#Sorted+listAll)

<a name="new_Sorted_new"></a>

### new Sorted(opts)
Creates a Sorted instance.


| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the Sorted list. |
| opts.comparator | <code>function</code> | The comparator function to sort the keys. |

<a name="Sorted+put"></a>

### sorted.put(key, value)
Inserts or updates a key-value pair in the list.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to insert or update. |
| value | <code>any</code> | The value associated with the key. |

<a name="Sorted+get"></a>

### sorted.get(key) ⇒ <code>any</code> \| <code>null</code>
Retrieves a value from the list based on the key.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  
**Returns**: <code>any</code> \| <code>null</code> - Returns the value if the key exists, otherwise returns null.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to search for. |

<a name="Sorted+del"></a>

### sorted.del(key)
Deletes a key-value pair from the list based on the key.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>any</code> | The key to delete. |

<a name="Sorted+iterator"></a>

### sorted.iterator(opts)
Iterator function for the list based on the given options.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the iterator. |
| opts.reverse | <code>boolean</code> | Whether to reverse the order of iteration. |

<a name="Sorted+createReadStream"></a>

### sorted.createReadStream(opts, mode) ⇒ <code>Readable</code>
Creates a readable stream based on the iterator.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  
**Returns**: <code>Readable</code> - Returns a readable stream.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| opts | <code>object</code> |  | Options for the readable stream. |
| mode | <code>string</code> | <code>&quot;kv&quot;</code> | Mode specifying the type of data to stream ('k', 'v', 'kv'). |

<a name="Sorted+createKeyStream"></a>

### sorted.createKeyStream(opts) ⇒ <code>Readable</code>
Creates a key-only readable stream.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  
**Returns**: <code>Readable</code> - Returns a readable stream.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the readable stream. |

<a name="Sorted+createValueStream"></a>

### sorted.createValueStream(opts) ⇒ <code>Readable</code>
Creates a value-only readable stream.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  
**Returns**: <code>Readable</code> - Returns a readable stream.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>object</code> | Options for the readable stream. |

<a name="Sorted+listAll"></a>

### sorted.listAll()
Logs all key-value pairs in the list.

**Kind**: instance method of [<code>Sorted</code>](#Sorted)  
