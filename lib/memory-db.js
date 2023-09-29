/**
 * @fileoverview
 * In-Memory Database Implementation.
 * 
 * This file contains classes and utilities for managing an in-memory database.
 * It provides basic CRUD operations and additional features like batch execution.
 */

const { _, log, Evented } = require('basd')
const SortedTree = require('./sorted-tree')
const { Batch, BatchExecutor } = require('./batch')

/**
 * In-memory database extending SortedTree and providing eventing.
 */
class MemoryDB extends Evented.mixin(SortedTree) {
  /**
   * Creates a MemoryDB instance.
   * @param {object} opts - Options for the MemoryDB.
   * @param {...any} args - Additional arguments.
   */
  constructor(opts = {}, ...args) {
    super(opts, ...args)
    if (!opts.parent) {
      if (this.constructor.instance) return this.constructor.instance
      this.constructor.instance = this
    }
    _.objProp(this, 'opts', MemoryDB.parseOptions(opts))
    _.objProp(this, '_ready', this.root.connect())
  }

  /**
   * Checks if the database is ready.
   * @async
   * @returns {Promise} Resolves when the database is ready.
   */
  async isReady() {
    await this._ready
  }

  /**
   * Puts a key-value pair into the database and emits a 'put' event.
   * @async
   * @param {any} key - The key to store.
   * @param {any} value - The value to store.
   * @returns {Promise} Resolves when the put operation is complete.
   */
  async put(key, value) {
    this.emit('put', key, value)
    return super.put(key, value)
  }

  /**
   * Retrieves a value associated with a key from the database.
   * @async
   * @param {any} key - The key to retrieve.
   * @returns {Promise<any>} The associated value.
   */
  async get(key) {
    return super.get(key)
  }

  /**
   * Deletes a key-value pair from the database and emits a 'del' event.
   * @async
   * @param {any} key - The key to delete.
   * @returns {Promise} Resolves when the delete operation is complete.
   */
  async del(key) {
    this.emit('del', key)
    return super.del(key)
  }

  /**
   * Sets additional options for the database.
   * @param {object} opts - Additional options.
   * @returns {MemoryDB} The updated MemoryDB instance.
   */
  setOpts(opts) {
    _.assign(this.opts, MemoryDB.parseOptions(opts, this.opts))
    return this
  }

  /**
   * Parses the given options.
   * @static
   * @param {object} opts - The options to parse.
   * @param {object} defaultOpts - Default options.
   * @returns {object} Parsed options.
   */
  static parseOptions(opts = {}, defaultOpts = {}) {
    opts = _.defaults({ ...opts }, {
      separator: '!',
      keyEncoding: 'utf8',
      valueEncoding: 'msgpack',
      ...defaultOpts
    })
    if (opts.keyEncoding === 'utf8' || opts.keyEncoding === 'utf-8') {
      opts.keyEncoding = {
        type: 'utf-8',
        encode: x => x,
        decode: x => x,
        buffer: false
      }
    } else if (opts.keyEncoding === 'lexint') {
      opts.keyEncoding = {
        type: 'lexicographic-integer/hex',
        encode: data => _.lexint.pack(data, 'hex'),
        decode: _.lexint.unpack,
        buffer: false
      }
    }
    if (opts.valueEncoding === 'utf8' || opts.valueEncoding === 'utf-8') {
      opts.valueEncoding = {
        type: 'utf-8',
        encode: x => x,
        decode: x => x,
        buffer: false
      }
    } else if (opts.valueEncoding === 'msgpack') {
      opts.valueEncoding = {
        type: 'binary',
        encode: _.msgpack.encode,
        decode: _.msgpack.decode,
        buffer: true
      }
    } else if (opts.valueEncoding === 'json') {
      opts.valueEncoding = {
        type: 'json',
        encode: JSON.stringify,
        decode: JSON.parse,
        buffer: true
      }
    }
    return opts
  }

  /**
   * Encodes a key using the configured encoding.
   * @private
   * @param {any} key - The key to encode.
   * @returns {any} The encoded key.
   */
  _keyEncode(key) {
    return this.opts.keyEncoding.encode(key)
  }

  /**
   * Encodes a value using the configured encoding.
   * @private
   * @param {any} value - The value to encode.
   * @returns {any} The encoded value.
   */
  _valueEncode(value) {
    return this.opts.valueEncoding.encode(value)
  }

  /**
   * Decodes a key using the configured encoding.
   * @private
   * @param {any} key - The key to decode.
   * @returns {any} The decoded key.
   */
  _keyDecode(key) {
    return this.opts.keyEncoding.decode(key)
  }

  /**
   * Decodes a value using the configured encoding.
   * @private
   * @param {any} value - The value to decode.
   * @returns {any} The decoded value.
   */
  _valueDecode(value) {
    return this.opts.valueEncoding.decode(value)
  }

  /**
   * Collects key-value pairs based on the provided type and options.
   * @async
   * @param {string|boolean|object} type - The type of data to collect ('key', 'value', or 'read').
   * @param {object} opts - Options for collecting data.
   * @returns {Promise<Array>} An array of collected data.
   */
  async collect(type, opts) {
    if (_.isBoolean(type))
      [type, opts] = [opts, { all: type }]
    else if (_.isObj(type))
      [type, opts] = [opts, type]
    opts = _.defaults(opts, this.opts)
    type = type ? type : opts.type ? opts.type : 'read'
    const result = []
    for (const [key, value] of this.iterator(opts))
      result.push(type === 'key' ? key : type === 'value' ? value : { key, value })
    return result
  }

  /**
   * Creates or executes a batch operation.
   * @param {Array} ops - An array of batch operations.
   * @returns {Promise|Batch} Returns a Promise if operations are provided, otherwise returns a new Batch instance.
   */
  batch(ops) {
    if (!ops) return new Batch(this)
    return this.isReady()
      .then(() => BatchExecutor.execute(this, ops))
  }
}

module.exports = MemoryDB
