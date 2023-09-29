declare module 'basd' {
  export function _(arg: any): any;
  export function log(arg: any): void;
  export class Readable {
    constructor(opts: any);
  }
  export class Pipe {}
  export class Evented {
    static mixin(...args: any[]): any;
  }
}

declare module '@plaindb/storage' {
  export default class Storage {
    put(key: any, value: any): Promise<any>;
    get(key: any): Promise<any>;
    del(key: any): Promise<any>;
    sub(path: string | string[]): Storage;
  }
}

declare module '@basd/nested' {
  class Nested {
    static mixin(...args: any[]): any;
  }
  export = Nested;
}

interface Options {
  comparator?: (key1: any, key2: any) => number;
  map?: Map<any, any>;
  separator?: string;
}

declare class Node {
  constructor(key: any, value: any);
  key: any;
  value: any;
  prev: Node | null;
  next: Node | null;
}

declare class Sorted {
  constructor(opts?: Options);
  put(key: any, value: any): void;
  get(key: any): any;
  del(key: any): void;
  iterator(opts?: any): Generator<[any, any], void, undefined>;
  createReadStream(opts?: any, mode?: string): Readable;
  createKeyStream(opts?: any): Readable;
  createValueStream(opts?: any): Readable;
  listAll(): void;
}

declare class SortedTree {
  constructor(opts?: any, ...args: any[]);
  put(key: any, value: any): void;
  get(key: any): any;
  del(key: any): void;
  sub(path: any, opts?: object): SortedTree;
  iterator(opts?: object): Generator<[any, any], void, undefined>;
  listAll(opts?: object): void;
}

declare class MemoryDB {
  constructor(opts?: object, ...args: any[]);
  isReady(): Promise<void>;
  put(key: any, value: any): Promise<void>;
  get(key: any): Promise<any>;
  del(key: any): Promise<void>;
  setOpts(opts: object): this;
  static parseOptions(opts?: object, defaultOpts?: object): object;
  collect(type: any, opts?: object): Promise<any[]>;
  batch(ops?: any): any;
}

export interface Operation {
  path?: string;
  type: 'put' | 'del';
  key: any;
  value?: any;
}

export class BatchExecutor {
  constructor(storage: Storage, performingUndo?: boolean);
  execute(ops: Operation[]): Promise<any[]>;
  createUndoOps(ops?: Operation[]): Promise<Operation[]>;
  getDb(path?: string): Storage;
  buildPromises(ops: Operation[]): Promise<any[]>;
  createUndoOp(op: Operation): Promise<Operation>;
  static execute(storage: Storage, ops: Operation[]): Promise<any[]>;
}

export class Batch {
  constructor(storage: Storage);
  put(key: any, value: any, sub?: string): this;
  del(key: any, sub?: string): this;
  build(): Operation[];
  exec(): Promise<any[]>;
  static execute(storage: Storage, arr: Operation[]): Promise<any[]>;
}
