export class SaferArray<ElementType> {
  array: ElementType[]
  addQueue: ElementType[]
  removeQueue: Set<ElementType>

  constructor() {
    this.array = []
    this.addQueue = []
    this.removeQueue = new Set()
  }

  get isEmpty() {
    return this.addQueue.length + this.array.length > 0
  }

  add(element: ElementType) {
    this.addQueue.push(element)
  }
  remove(element: ElementType) {
    this.removeQueue.add(element)
  }
  forEach(fn: (ele: ElementType) => void) {
    this._addQueued()
    this._removeQueued()
    for (const element of this.array) {
      if (this.removeQueue.has(element)) {
        continue
      }
      fn(element)
    }
  }
  _addQueued() {
    if (this.addQueue.length) {
      this.array.splice(this.array.length, 0, ...this.addQueue)
      this.addQueue = []
    }
  }

  _removeQueued() {
    if (this.removeQueue.size) {
      this.array = this.array.filter(ele => !this.removeQueue.has(ele))
      this.removeQueue.clear()
    }
  }
}
