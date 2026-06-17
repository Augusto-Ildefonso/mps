// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { pedidosClient } from '../axiosClients.js'
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  updateOrderItems,
  deleteOrder,
} from '../orders.js'

const mockOrder = {
  id: 42,
  customer_id: '550e8400-e29b-41d4-a716-446655440000',
  stat: 'processando',
  created_at: '2026-06-14T15:32:00Z',
  updated_at: '2026-06-14T15:32:00Z',
}

const mockCompleteOrder = {
  order: mockOrder,
  items: [{ id: 1, id_order: 42, id_product: 108, quantity: 2, unit_price: 67.9, created_at: '2026-06-14T15:32:00Z' }],
  total: 135.8,
}

let mock

beforeEach(() => {
  mock = new MockAdapter(pedidosClient)
})

afterEach(() => {
  mock.restore()
})

describe('createOrder', () => {
  it('posts items and returns CompleteOrder', async () => {
    mock
      .onPost('/api/pedidos')
      .reply(200, { status: 'ok', data: { order: mockCompleteOrder }, message: null })

    const result = await createOrder({ items: [{ id_product: 108, quantity: 2 }] })
    expect(result.order.id).toBe(42)
    expect(result.total).toBe(135.8)
  })

  it('throws with items array on stock validation failure', async () => {
    mock.onPost('/api/pedidos').reply(422, {
      status: 'error',
      message: 'Product validation failed',
      items: [{ id_product: 999, reason: 'product not found' }],
    })

    let caught
    try {
      await createOrder({ items: [{ id_product: 999, quantity: 1 }] })
    } catch (err) {
      caught = err
    }
    expect(caught.message).toBe('Product validation failed')
    expect(caught.items[0].id_product).toBe(999)
  })
})

describe('listOrders', () => {
  it('normalizes CompleteOrder[] to flat shape with _items and _total', async () => {
    const apiCompleteOrder = { order: mockOrder, items: mockCompleteOrder.items, total: mockCompleteOrder.total }
    mock
      .onGet('/api/pedidos')
      .reply(200, { status: 'ok', data: { orders: [apiCompleteOrder] }, message: null })

    const result = await listOrders()
    expect(result).toHaveLength(1)
    expect(result[0].stat).toBe('processando')
    expect(result[0]._items).toHaveLength(1)
    expect(result[0]._total).toBe(135.8)
  })
})

describe('getOrder', () => {
  it('returns CompleteOrder for given id', async () => {
    mock
      .onGet('/api/pedidos/42')
      .reply(200, { status: 'ok', data: { order: mockCompleteOrder }, message: null })

    const result = await getOrder(42)
    expect(result.order.id).toBe(42)
    expect(result.items).toHaveLength(1)
  })

  it('throws 401 when order belongs to another customer', async () => {
    mock
      .onGet('/api/pedidos/99')
      .reply(401, { status: 'error', message: 'Unauthorized' })

    await expect(getOrder(99)).rejects.toMatchObject({ status: 401 })
  })
})

describe('updateOrderStatus', () => {
  it('patches status and returns updated Order', async () => {
    const updated = { ...mockOrder, stat: 'confirmado' }
    mock
      .onPatch('/api/pedidos/42/status')
      .reply(200, { status: 'ok', data: { order: updated }, message: null })

    const result = await updateOrderStatus(42, 'confirmado')
    expect(result.stat).toBe('confirmado')
    expect(JSON.parse(mock.history.patch[0].data).status).toBe('confirmado')
  })
})

describe('updateOrderItems', () => {
  it('patches items and returns updated CompleteOrder', async () => {
    const updatedComplete = { order: { ...mockOrder, updated_at: '2026-06-15T10:00:00Z' }, items: mockCompleteOrder.items, total: mockCompleteOrder.total }
    mock
      .onPatch('/api/pedidos/42/items')
      .reply(200, { status: 'ok', data: { order: updatedComplete }, message: null })

    const payload = { add: [{ id_product: 110, quantity: 1 }] }
    const result = await updateOrderItems(42, payload)
    expect(result.order.id).toBe(42)
    expect(result.items).toHaveLength(1)
    expect(JSON.parse(mock.history.patch[0].data)).toMatchObject(payload)
  })

  it('throws 422 when order status prevents item modification', async () => {
    mock.onPatch('/api/pedidos/42/items').reply(422, {
      status: 'error',
      message: "Items can only be modified when order status is 'processando'",
    })

    await expect(updateOrderItems(42, {})).rejects.toMatchObject({
      status: 422,
    })
  })

  it('throws 404 when item not found', async () => {
    mock.onPatch('/api/pedidos/42/items').reply(404, {
      status: 'error',
      message: 'OrderItem with ID 43 not found',
    })

    await expect(updateOrderItems(42, { update: [{ id: 43, quantity: 5 }] })).rejects.toMatchObject({
      status: 404,
    })
  })
})

describe('deleteOrder', () => {
  it('sends DELETE and returns deleted Order', async () => {
    mock
      .onDelete('/api/pedidos/42')
      .reply(200, { status: 'success', data: { order: mockOrder }, message: null })

    const result = await deleteOrder(42)
    expect(result.id).toBe(42)
  })
})
