import { produtosClient } from './axiosClients.js'

const PRODUTOS_BASE_URL = import.meta.env?.VITE_PRODUTOS_API_URL ?? 'http://localhost:3000'

/**
 * Returns the full URL for a product image given its path (UUID filename).
 * @param {string} path - e.g. "3f2e1a4b-uuid.jpg"
 */
export function getProductImageUrl(path) {
  return `${PRODUTOS_BASE_URL}/static/${path}`
}

/**
 * List all products with optional pagination.
 * @param {number} [limit] - max results
 * @param {number} [offset] - number of results to skip
 * @returns {Promise<Product[]>}
 */
export async function listProducts(limit, offset) {
  const params = {}
  if (limit != null) params.limit = limit
  if (offset != null) params.offset = offset
  const response = await produtosClient.get('/api/products', { params })
  return response.data.data.products
}

/**
 * Fuzzy search products by name/brand.
 * @param {string} q - search query
 * @param {number} [limit] - max results
 * @returns {Promise<Product[]>}
 */
export async function searchProducts(q, limit) {
  const params = { q }
  if (limit != null) params.limit = limit
  const response = await produtosClient.get('/api/products/search', { params })
  return response.data.data.products
}

/**
 * Fetch a single product by integer ID.
 * @param {number|string} id
 * @returns {Promise<Product>}
 */
export async function getProduct(id) {
  const response = await produtosClient.get(`/api/products/${id}`)
  return response.data.data.product
}

/**
 * Create a new product.
 * @param {{ nome, marca, num_fab?, unidade, valor, descricao?, estoque? }} data
 * @returns {Promise<Product>}
 */
export async function createProduct(data) {
  const response = await produtosClient.post('/api/products', data)
  return response.data.data.product
}

/**
 * Partially update a product.
 * @param {number} id
 * @param {{ nome?, marca?, num_fab?, unidade?, valor?, descricao?, estoque? }} data
 * @returns {Promise<Product>}
 */
export async function updateProduct(id, data) {
  const response = await produtosClient.patch(`/api/products/${id}`, data)
  return response.data.data.product
}

/**
 * Delete a product by ID. Cascades to its images.
 * @param {number} id
 * @returns {Promise<Product>}
 */
export async function deleteProduct(id) {
  const response = await produtosClient.delete(`/api/products/${id}`)
  return response.data.data.product
}

/**
 * Upload an image for a product (multipart/form-data, max 5 MB).
 * @param {number} id - product ID
 * @param {File} file
 * @returns {Promise<ProductImage>}
 */
export async function uploadProductImage(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await produtosClient.post(`/api/products/${id}/imagens`, formData)
  return response.data.data.image
}

/**
 * List all images for a product.
 * @param {number} id
 * @returns {Promise<ProductImage[]>}
 */
export async function listProductImages(id) {
  const response = await produtosClient.get(`/api/products/${id}/imagens`)
  return response.data.data.images
}

/**
 * Delete a product image by image ID.
 * @param {number} id - product ID
 * @param {number} imgId - image ID
 * @returns {Promise<ProductImage>}
 */
export async function deleteProductImage(id, imgId) {
  const response = await produtosClient.delete(`/api/products/${id}/imagens/${imgId}`)
  return response.data.data.image
}
