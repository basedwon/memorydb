/**
 * @fileoverview
 * Sorted Data Management.
 * 
 * This file contains the Sorted class for managing sorted sets of data.
 */

const { _, log } = require('basd')
const { Readable } = require('basd/pipe')

/**
 * Represents a Node in a doubly linked list.
 */
class Node {
  /**
   * Creates a new Node instance.
   * @param {any} key - The key associated with the node.
   * @param {any} value - The value associated with the node.
   */
  constructor(key, value) {
    _.objProp(this, 'key', !_.isNil(key) ? key : null)
    _.objProp(this, 'value', !_.isNil(value) ? value : null, { writable: true, show: true })
    _.objProp(this, 'prev', null, { writable: true })
    _.objProp(this, 'next', null, { writable: true })
  }
}

/**
 * Sorted doubly linked list with Map based indexing.
 */
class Sorted {
  /**
   * Creates a Sorted instance.
   * @param {object} opts - Options for the Sorted list.
   * @param {function} opts.comparator - The comparator function to sort the keys.
   */
  constructor(opts = {}) {
    _.objProp(this, 'comparator', opts.comparator || this._defaultComparator)
    _.objProp(this, 'head', new Node())
    _.objProp(this, 'tail', new Node())
    this.head.next = this.tail
    this.tail.prev = this.head
    this.map = opts.map || new Map()
    _.objProp(this, 'options', { ...opts, comparator: this.comparator, separator: this.separator })
  }

  /**
   * Default comparator function.
   * @private
   * @param {any} key1 - First key for comparison.
   * @param {any} key2 - Second key for comparison.
   * @returns {number} Returns 1 if key1 > key2, -1 if key1 < key2, and 0 otherwise.
   */
  _defaultComparator(key1, key2) {
    return key1 > key2 ? 1 : key1 < key2 ? -1 : 0
  }

  /**
   * Inserts or updates a key-value pair in the list.
   * @param {any} key - The key to insert or update.
   * @param {any} value - The value associated with the key.
   */
  put(key, value) {
    let node = this.map.get(key)
    if (node) {
      node.value = value
    } else {
      node = new Node(key, value)
      this.map.set(key, node)
      let current = this.head.next
      while (current !== this.tail && this.comparator(key, current.key) >= 0)
        current = current.next
      node.prev = current.prev
      node.next = current
      current.prev.next = node
      current.prev = node
    }
  }

  /**
   * Retrieves a value from the list based on the key.
   * @param {any} key - The key to search for.
   * @returns {any|null} Returns the value if the key exists, otherwise returns null.
   */
  get(key) {
    const node = this.map.get(key)
    return node ? node.value : null
  }

  /**
   * Deletes a key-value pair from the list based on the key.
   * @param {any} key - The key to delete.
   */
  del(key) {
    const node = this.map.get(key)
    if (!node) return
    this.map.delete(key)
    node.prev.next = node.next
    node.next.prev = node.prev
  }

  /**
   * Iterator function for the list based on the given options.
   * @generator
   * @param {object} opts - Options for the iterator.
   * @param {boolean} opts.reverse - Whether to reverse the order of iteration.
   * @yields {Array} Yields an array [key, value].
   */
  *iterator(opts = {}) {
    const reverse = opts.reverse || false
    let node = reverse ? this.tail.prev : this.head.next
    while (node !== (reverse ? this.head : this.tail)) {
      const key = node.key
      if ((!opts.gt || this.comparator(key, opts.gt) > 0) 
        && (!opts.gte || this.comparator(key, opts.gte) >= 0) 
        && (!opts.lt || this.comparator(key, opts.lt) < 0) 
        && (!opts.lte || this.comparator(key, opts.lte) <= 0))
        yield [key, node.value]
      node = reverse ? node.prev : node.next
    }
  }

  /**
   * Creates a readable stream based on the iterator.
   * @param {object} opts - Options for the readable stream.
   * @param {string} mode - Mode specifying the type of data to stream ('k', 'v', 'kv').
   * @returns {Readable} Returns a readable stream.
   */
  createReadStream(opts = {}, mode = 'kv') {
    const iterator = this.iterator(opts)
    const readable = new Readable({
      objectMode: true,
      read() {
        const { value: arr, done } = iterator.next()
        if (done) return this.push(null)
        const [key, value] = arr
        this.push(mode === 'k' ? key : mode === 'v' ? value : { key, value })
      },
    })
    return readable
  }

  /**
   * Creates a key-only readable stream.
   * @param {object} opts - Options for the readable stream.
   * @returns {Readable} Returns a readable stream.
   */
  createKeyStream(opts = {}) {
    return this.createReadStream(opts, 'k')
  }

  /**
   * Creates a value-only readable stream.
   * @param {object} opts - Options for the readable stream.
   * @returns {Readable} Returns a readable stream.
   */
  createValueStream(opts = {}) {
    return this.createReadStream(opts, 'v')
  }

  /**
   * Logs all key-value pairs in the list.
   */
  listAll() {
    for (const [key, value] of this.iterator())
      log({ key, value })
  }
}

module.exports = Sorted
