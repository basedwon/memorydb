/**
 * @fileoverview
 * Batch Operation Management for Storage.
 * 
 * This file contains classes for executing batch operations on a storage instance.
 * - BatchExecutor: Handles the execution of a batch of operations.
 * - Batch: A builder class to construct batch operations.
 */

const { _, log, Pipe } = require('basd')
const Storage = require('@plaindb/storage')
const Sorted = require('./sorted')

/**
 * Class responsible for executing a batch of operations atomically.
 */
class BatchExecutor {
  /**
   * Creates a BatchExecutor instance.
   * @param {Storage} storage - The storage instance where operations are performed.
   * @param {boolean} performingUndo - Flag indicating if undo operations should be performed.
   */
  constructor(storage, performingUndo = false) {
    this.storage = storage
    this.performingUndo = performingUndo
  }

  /**
   * Executes the given operations atomically.
   * @async
   * @param {Array} ops - Array of operations to execute.
   * @returns {Promise} Resolves when all operations have been executed.
   */
  async execute(ops) {
    const undoOps = this.performingUndo ? [] : await this.createUndoOps(ops)
    const prom = this.buildPromises(ops)
    try {
      return await Promise.all(prom)
    } catch (error) {
      // Rollback if an error occurs
      if (!this.performingUndo) {
        const executor = new BatchExecutor(this.storage, true)
        await executor.execute(undoOps)
      }
      throw error // Re-throw the error for the caller to handle
    }
  }

  /**
   * Creates undo operations for the given array of operations.
   * @async
   * @param {Array} ops - The operations for which to create undo operations.
   * @returns {Promise<Array>} Resolves with an array of undo operations.
   */
  async createUndoOps(ops = []) {
    return Promise.all(ops.map(this.createUndoOp, this))
  }

  /**
   * Gets a database instance based on a given path.
   * @param {string} [path] - The sub-path for the database.
   * @returns {Storage} The database instance.
   */
  getDb(path) {
    return path ? this.storage.sub(path) : this.storage
    // return path ? this.storage.sub(_.isString(path) ? path.split('.') : path) : this.storage
  }

  /**
   * Builds an array of promises for the given operations.
   * @param {Array} ops - The operations for which to create promises.
   * @returns {Array<Promise>} An array of promises representing the operations.
   */
  buildPromises(ops) {
    return ops.map(({ path, type, key, value }) => {
      const db = this.getDb(path)
      if (type === 'put') return db.put(key, value)
      if (type === 'del') return db.del(key)
      return Promise.resolve() // Handle any unexpected operations
    })
  }

  /**
   * Creates an undo operation for a single operation.
   * @async
   * @param {Object} operation - The operation for which to create an undo operation.
   * @returns {Promise<Object>} Resolves with the undo operation.
   */
  async createUndoOp({ path, type, key }) {
    const db = this.getDb(path)
    const value = await db.get(key)
    if (type === 'put')
      return value == null ? { type: 'del', key, path } : { type: 'put', key, value, path }
    else if (type === 'del')
      return { type: 'put', key, value, path }
  }

  /**
   * Executes batch operations statically.
   * @param {Storage} storage - The storage instance.
   * @param {Array} ops - Array of operations to execute.
   * @returns {Promise} Resolves when all operations have been executed.
   */
  static execute(storage, ops) {
    const executor = new this(storage)
    return executor.execute(ops)
  }
}

/**
 * Class responsible for building a batch of operations.
 */
class Batch {
  /**
   * Creates a Batch instance.
   * @param {Storage} storage - The storage instance where operations are performed.
   */
  constructor(storage) {
    this.storage = storage
    this.operations = []
  }

  /**
   * Adds a put operation to the batch.
   * @param {any} key - The key for the operation.
   * @param {any} value - The value for the operation.
   * @param {string} [sub] - Optional sub-path.
   * @returns {Batch} Returns the current Batch instance.
   */
  put(key, value, sub) {
    const operation = { type: 'put', key, value }
    if (sub) operation.sub = sub
    this.operations.push(operation)
    return this
  }

  /**
   * Adds a delete operation to the batch.
   * @param {any} key - The key for the operation.
   * @param {string} [sub] - Optional sub-path.
   * @returns {Batch} Returns the current Batch instance.
   */
  del(key, sub) {
    const operation = { type: 'del', key }
    if (sub) operation.sub = sub
    this.operations.push(operation)
    return this
  }

  /**
   * Builds the batch operations.
   * @returns {Array} Array of batch operations.
   */
  build() {
    return this.operations.slice()
  }

  /**
   * Executes the batch operations atomically.
   * @async
   * @returns {Promise} Resolves when all operations have been executed.
   */
  async exec() {
    return BatchExecutor.execute(this.storage, this.build())
  }

  /**
   * Executes an array of operations atomically.
   * @static
   * @param {Storage} storage - The storage instance.
   * @param {Array} arr - Array of operations to execute.
   * @returns {Promise} Resolves when all operations have been executed.
   */
  static execute(storage, arr) {
    const prom = []
    for (const op of arr) {
      const { path, type, key, value } = op
      let db = storage
      if (path) db = db.sub(path)
      if (type === 'put') {
        prom.push(db.put(key, value))
      } else if (type === 'del') {
        prom.push(db.del(key))
      }
    }
    return Promise.all(prom)
  }
}

module.exports = { Batch, BatchExecutor }
