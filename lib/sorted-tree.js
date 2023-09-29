/**
 * @fileoverview
 * Sorted Tree Data Structure.
 * 
 * This file contains the implementation of a sorted tree data structure.
 * The sorted tree ensures that elements are always in a sorted order.
 */

const { _, log, Pipe } = require('basd')
const Nested = require('@basd/nested')
const Sorted = require('./sorted')
const Storage = require('@plaindb/storage')

/**
 * Nested and Sorted structure, extending functionalities from Nested and Storage mixins.
 */
class SortedTree extends Nested.mixin(Storage) {
  /**
   * Creates a SortedTree instance.
   * @param {object} opts - Options for the SortedTree.
   * @param {...any} args - Additional arguments.
   */
  constructor(opts = {}, ...args) {
    if (opts instanceof SortedTree) return opts
    super(opts, ...args)
    _.objProp(this, 'sorted', new Sorted(opts), { show: false })
    _.objProp(this, 'children', new Sorted(), { show: false })
    _.objProp(this, 'separator', opts.separator || '!')
    for (const method of ['keyEncode', 'valueEncode', 'keyDecode', 'valueDecode'])
      if (_.isFunction(opts[method]))
        _.objProp(this, `_${method}`, opts[method].bind(this))
  }

  /**
   * Encodes the key.
   * @param {any} key - The key to be encoded.
   * @returns {any} - The encoded key.
   */
  _keyEncode(key) {
    return key
  }

  /**
   * Encodes the value.
   * @param {any} value - The value to be encoded.
   * @returns {any} - The encoded value.
   */
  _valueEncode(value) {
    return value
  }

  /**
   * Decodes the key.
   * @param {any} key - The key to be decoded.
   * @returns {any} - The decoded key.
   */
  _keyDecode(key) {
    return key
  }

  /**
   * Decodes the value.
   * @param {any} value - The value to be decoded.
   * @returns {any} - The decoded value.
   */
  _valueDecode(value) {
    return value
  }

  /**
   * Inserts or updates a key-value pair.
   * @param {any} key - The key to insert or update.
   * @param {any} value - The value to insert or update.
   */
  put(key, value) {
    this.sorted.put(this._keyEncode(key), this._valueEncode(value))
  }

  /**
   * Retrieves a value by its key.
   * @param {any} key - The key for which to retrieve the value.
   * @returns {any} - The retrieved value, or null if the key doesn't exist.
   */
  get(key) {
    const value = this.sorted.get(this._keyEncode(key))
    return !_.isNil(value) ? this._valueDecode(value) : null
  }

  /**
   * Deletes a key-value pair by its key.
   * @param {any} key - The key to delete.
   */
  del(key) {
    this.sorted.del(this._keyEncode(key))
  }

  /**
   * Creates a sub SortedTree.
   * @param {string|array} path - The path for the sub SortedTree.
   * @param {object} opts - Additional options.
   * @returns {SortedTree} - The sub SortedTree.
   */
  sub(path, opts = {}) {
    let node = this
    for (const part of _.toArray(path)) {
      let child = node.children.get(part)
      if (!child) {
        const newOpts = {
          ...node.sorted.options,
          parent: node,
          path: node.path.slice().concat(part),
          comparator: node.sorted.comparator,
          separator: node.separator,
          ...opts
        }
        child = new this.constructor(newOpts)
        node.children.put(part, child)
      }
      node = child
    }
    return node
  }

  /**
   * An iterator over the SortedTree.
   * @param {object} opts - Iterator options.
   * @yields {array} An array containing a key-value pair.
   */
  *iterator(opts = {}) {
    const separator = opts.separator || '!'
    const processNode = function* (node, path) {
      for (let [key, value] of node.sorted.iterator(opts)) {
        key = node._keyDecode(key)
        const fullKey = path.length && opts.all
          ? `${separator}${path.join(separator.repeat(2))}${separator}${key}`
          : key
        yield [fullKey, node._valueDecode(value)]
      }
      if (opts.all) {
        for (const [childKey, childNode] of node.children.iterator()) {
          yield* processNode(childNode, path.concat(childKey))
        }
      }
    }
    yield* processNode(this, this.path.slice())
  }

  /**
   * Lists all key-value pairs.
   * @param {object} opts - Additional options for listing.
   */
  listAll(opts = {}) {
    for (const [key, value] of this.iterator({ all: true, ...opts }))
      _.print({ key, value })
  }
}

module.exports = SortedTree
