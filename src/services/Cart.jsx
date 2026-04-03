class Cart {
    constructor() {
        this.items = []
        this.quantities = new Map()
    }

    addItem(itemOrId) {
        const itemId = typeof itemOrId === "object" ? itemOrId?.id : itemOrId

        if (itemId == null) {
            return
        }

        const existingItemIndex = this.items.findIndex((currentItem) => currentItem.id === itemId)

        if (existingItemIndex >= 0) {
            const currentNumber = this.quantities.get(itemId) ?? 0
            this.quantities.set(itemId, currentNumber + 1)
        } else {
            this.items.push(new CartItem(itemId))
            this.quantities.set(itemId, 1)
        }
    }

    decreaseItem(itemId) {
        const existingItemIndex = this.items.findIndex((currentItem) => currentItem.id === itemId)

        if (existingItemIndex < 0) {
            return
        }

        const currentNumber = this.quantities.get(itemId) ?? 0
        const nextNumber = currentNumber - 1

        if (nextNumber <= 0) {
            this.removeItem(itemId)
            return
        }

        this.quantities.set(itemId, nextNumber)
    }

    removeItem(itemId) {
        this.items = this.items.filter((item) => item.id !== itemId)
        this.quantities.delete(itemId)
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
