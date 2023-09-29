const Sorted = require('../lib/sorted')
const SortedTree = require('../lib/sorted-tree')
const MemoryDB = require('../lib/memory-db')
const { Batch, BatchExecutor } = require('../lib/batch')

describe('MemoryDB', () => {
  let db

  before(async () => {
    db = new MemoryDB()
    await db.isReady()
  })

  it('should put and get a value', async () => {
    await db.put('key', 'value')
    const result = await db.get('key')
    expect(result).to.equal('value')
  })

  it('should delete a value', async () => {
    await db.put('key', 'value')
    await db.del('key')
    const result = await db.get('key')
    expect(result).to.be.null
  })

  it('should collect values', async () => {
    await db.put('key1', 'value1')
    await db.put('key2', 'value2')
    const result = await db.collect('read')
    expect(result).to.deep.equal([{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}])
  })

  describe('#put', () => {
    it('should insert a key-value pair', async () => {
      await db.put('key1', 'value1')
      const result = await db.get('key1')
      expect(result).to.equal('value1')
    })

    it('should update an existing key', async () => {
      await db.put('key1', 'value1')
      await db.put('key1', 'value2')
      const result = await db.get('key1')
      expect(result).to.equal('value2')
    })
  })

  describe('#get', () => {
    it('should return null for a non-existent key', async () => {
      const result = await db.get('nokey')
      expect(result).to.equal(null)
    })
  })

  describe('#del', () => {
    it('should delete an existing key', async () => {
      await db.put('key1', 'value1')
      await db.del('key1')
      const result = await db.get('key1')
      expect(result).to.equal(null)
    })

    it('should not throw for a non-existent key', async () => {
      await db.del('nokey')
    })
  })

  describe('#setOpts', () => {
    it('should allow changing the separator', () => {
      db.setOpts({ separator: '-' })
      expect(db.opts.separator).to.equal('-')
    })

    it('should not overwrite existing options', () => {
      db.setOpts({ separator: '-' })
      expect(db.opts.keyEncoding.type).to.equal('utf-8')
    })
  })

  describe('#collect', () => {
    it('should collect all keys and values', async () => {
      await db.put('key1', 'value1')
      await db.put('key2', 'value2')
      const result = await db.collect()
      expect(result).to.deep.equal([
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' }
      ])
    })

    it('should collect only keys', async () => {
      await db.put('key1', 'value1')
      await db.put('key2', 'value2')
      const result = await db.collect('key')
      expect(result).to.deep.equal(['key1', 'key2'])
    })

    it('should collect only values', async () => {
      await db.put('key1', 'value1')
      await db.put('key2', 'value2')
      const result = await db.collect('value')
      expect(result).to.deep.equal(['value1', 'value2'])
    })
  })

  describe('#batch', () => {
    it('should perform batch operations', async () => {
      const ops = [
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'put', key: 'key2', value: 'value2' },
        { type: 'del', key: 'key1' }
      ]
      await db.batch(ops)
      expect(await db.get('key1')).to.equal(null)
      expect(await db.get('key2')).to.equal('value2')
    })

    it('should handle empty operations', async () => {
      const ops = []
      await db.batch(ops)
    })
  })
})

describe('Sorted', () => {
  let sorted

  before(() => {
    sorted = new Sorted()
  })

  it('should put and get a value', () => {
    sorted.put('key', 'value')
    expect(sorted.get('key')).to.equal('value')
  })

  it('should delete a value', () => {
    sorted.put('key', 'value')
    sorted.del('key')
    expect(sorted.get('key')).to.be.null
  })
})

describe('SortedTree', () => {
  let sortedTree

  before(() => {
    sortedTree = new SortedTree()
  })

  it('should put and get a value', () => {
    sortedTree.put('key', 'value')
    expect(sortedTree.get('key')).to.equal('value')
  })

  it('should delete a value', () => {
    sortedTree.put('key', 'value')
    sortedTree.del('key')
    expect(sortedTree.get('key')).to.be.null
  })

  it('should work with sub-trees', () => {
    const subTree = sortedTree.sub('sub')
    subTree.put('key', 'value')
    expect(subTree.get('key')).to.equal('value')
  })
})

describe('Batch and BatchExecutor', () => {
  let storage

  describe('Batch class', () => {
    before(() => {
      storage = new MemoryDB()
    })
    it('should add put operations', () => {
      const batch = new Batch(storage)
      batch.put('key1', 'value1')
      expect(batch.operations).to.deep.equal([{ type: 'put', key: 'key1', value: 'value1' }])
    })

    it('should add del operations', () => {
      const batch = new Batch(storage)
      batch.del('key1')
      expect(batch.operations).to.deep.equal([{ type: 'del', key: 'key1' }])
    })

    it('should build operations', () => {
      const batch = new Batch(storage)
      batch.put('key1', 'value1').del('key2')
      const operations = batch.build()
      expect(operations).to.deep.equal([
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'del', key: 'key2' }
      ])
    })

    it('should execute batch operations', async () => {
      const batch = new Batch(storage)
      batch.put('key1', 'value1').del('key2')
      await batch.exec()
      expect(await storage.get('key1')).to.equal('value1')
      expect(await storage.get('key2')).to.equal(null)
    })
  })

  describe('BatchExecutor class', () => {
    before(() => {
      storage = new MemoryDB()
    })

    it('should execute put and del operations', async () => {
      const ops = [
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'put', key: 'key2', value: 'value2' },
        { type: 'del', key: 'key1' }
      ]
      await BatchExecutor.execute(storage, ops)
      expect(await storage.get('key1')).to.equal(null)
      expect(await storage.get('key2')).to.equal('value2')
    })

    it('should rollback on error', async () => {
      const ops = [
        { type: 'put', key: 'key1', value: 'value1' },
        { type: 'invalid', key: 'key2', value: 'value2' },
        { type: 'del', key: 'key1' }
      ]
      try {
        await BatchExecutor.execute(storage, ops)
      } catch (error) {
        expect(await storage.get('key1')).to.equal(null)
      }
    })
  })
})






