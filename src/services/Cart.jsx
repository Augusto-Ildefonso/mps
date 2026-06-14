class Cart {
  constructor() {
    this.items = []
    this.quantities = new Map()
    this._load()
  }

  _save() {
    try {
      const data = {
        items: this.items,
        quantities: Array.from(this.quantities.entries()),
      }
      localStorage.setItem('cart', JSON.stringify(data))
    } catch {
      // localStorage quota exceeded — silently ignore
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem('cart')
      if (!raw) return
      const data = JSON.parse(raw)
      this.items = data.items ?? []
      this.quantities = new Map(data.quantities ?? [])
    } catch {
      // Corrupted data — start with an empty cart
      this.items = []
      this.quantities = new Map()
    }
  }

  addItem(itemOrId) {
    const itemId = typeof itemOrId === 'object' ? itemOrId?.id : itemOrId
    if (itemId == null) return

    const existingIndex = this.items.findIndex((item) => item.id === itemId)
    if (existingIndex >= 0) {
      const current = this.quantities.get(itemId) ?? 0
      this.quantities.set(itemId, current + 1)
    } else {
      this.items.push(new CartItem(itemId))
      this.quantities.set(itemId, 1)
    }
    this._save()
  }

  decreaseItem(itemId) {
    const existingIndex = this.items.findIndex((item) => item.id === itemId)
    if (existingIndex < 0) return

    const current = this.quantities.get(itemId) ?? 0
    const next = current - 1
    if (next <= 0) {
      this.removeItem(itemId)
      return
    }
    this.quantities.set(itemId, next)
    this._save()
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId)
    this.quantities.delete(itemId)
    this._save()
  }

  /** Remove all items from the cart and clear localStorage. */
  clear() {
    this.items = []
    this.quantities = new Map()
    this._save()
  }

  getItems() {
    return this.items.map((item) => ({
      ...item,
      number: this.getQuantity(item.id),
    }))
  }

  getQuantity(itemId) {
    return this.quantities.get(itemId) ?? 0
  }
}

class CartItem {
  constructor(id) {
    this.id = id
  }
}

const cart = new Cart()

export { cart, CartItem }
