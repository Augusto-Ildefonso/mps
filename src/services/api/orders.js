import { pedidosClient } from './axiosClients.js'

/**
 * Create a new order.
 * @param {{ items: Array<{ id_product: number, quantity: number }> }} payload
 * @returns {Promise<CompleteOrder>}
 */
export async function createOrder(payload) {
  const response = await pedidosClient.post('/api/pedidos', payload)
  return response.data.data.order
}

/**
 * List orders for the authenticated customer (lightweight — no items/total).
 * @param {{ status?: string, limit?: number }} [params]
 * @returns {Promise<Order[]>}
 */
export async function listOrders(params) {
  const response = await pedidosClient.get('/api/pedidos', { params })
  return response.data.data.orders
}

/**
 * Fetch a single order with all items and computed total.
 * @param {number} id
 * @returns {Promise<CompleteOrder>}
 */
export async function getOrder(id) {
  const response = await pedidosClient.get(`/api/pedidos/${id}`)
  return response.data.data.order
}

/**
 * Transition an order to a new status.
 * Valid: confirmado | enviado | entregue | cancelado | rejeitado
 * @param {number} id
 * @param {string} status
 * @returns {Promise<Order>}
 */
export async function updateOrderStatus(id, status) {
  const response = await pedidosClient.patch(`/api/pedidos/${id}/status`, { status })
  return response.data.data.order
}

/**
 * Add, update, or remove items (only when order is 'processando').
 * @param {number} id
 * @param {{ add?: Array<{id_product, quantity}>, update?: Array<{id, quantity}>, remove?: number[] }} payload
 * @returns {Promise<CompleteOrder>}
 */
export async function updateOrderItems(id, payload) {
  const response = await pedidosClient.patch(`/api/pedidos/${id}/items`, payload)
  return response.data.data.order
}

/**
 * Delete an order (only when 'processando' or 'cancelado').
 * @param {number} id
 * @returns {Promise<Order>}
 */
export async function deleteOrder(id) {
  const response = await pedidosClient.delete(`/api/pedidos/${id}`)
  return response.data.data.order
}
