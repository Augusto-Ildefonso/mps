# API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the React front-end to the `produtos-api` (port 3000) and `pedidos-api` (port 3001) microservices using a centralized axios service layer with a mocked auth stub.

**Architecture:** Two pre-configured axios instances in `axiosClients.js` — one per microservice. The pedidos instance attaches the JWT from `localStorage.authToken` via a request interceptor. Both instances normalize errors in a response interceptor. Plain async service functions in `products.js` and `orders.js` call these clients; components call the service functions. `AuthContext` manages the JWT lifecycle.

**Tech Stack:** React 19, Vite 8, Axios, Vitest, axios-mock-adapter

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/services/api/axiosClients.js` | Two axios instances + interceptors |
| Create | `src/services/api/products.js` | All produtos-api calls |
| Create | `src/services/api/orders.js` | All pedidos-api calls |
| Create | `src/services/api/__tests__/axiosClients.test.js` | Interceptor unit tests |
| Create | `src/services/api/__tests__/products.test.js` | Product service unit tests |
| Create | `src/services/api/__tests__/orders.test.js` | Order service unit tests |
| Create | `src/context/AuthContext.jsx` | JWT state + localStorage persistence |
| Create | `.env.local` | Dev env vars (git-ignored) |
| Modify | `package.json` | Add axios, vitest, axios-mock-adapter |
| Modify | `vite.config.js` | Add test config |
| Modify | `src/main.jsx` | Wrap app in AuthProvider |
| Modify | `src/App.jsx` | Fix `/product` → `/product/:id` |
| Modify | `src/services/Cart.jsx` | localStorage persistence + `clear()` |
| Modify | `src/component/admin/management/managementUtils.js` | Add `buildApiProductPayload`, add `unidade` to empty form |
| Modify | `src/pages/Login.jsx` | Call `setToken` on submit |
| Modify | `src/component/ProductCard/ProductCard.jsx` | Navigate to `/product/:id` |
| Modify | `src/component/ProductSearchCard/ProductSearchCard.jsx` | Navigate to `/product/:id` |
| Modify | `src/component/SearchBar/SearchBar.jsx` | Accept `onSearch` callback |
| Modify | `src/pages/SearchPage.jsx` | Real search, fix scroll bug |
| Modify | `src/pages/ProductPage.jsx` | `useParams`, real fetch, images |
| Modify | `src/pages/checkout/CheckoutReviewPage.jsx` | Async cart fetch + `createOrder` |
| Modify | `src/component/Orders/OrderBlock.jsx` | Accept API order shape, lazy-fetch detail |
| Modify | `src/pages/account/Orders.jsx` | `listOrders()` on mount |
| Modify | `src/component/AccountPanels/AccountOrdersPanel.jsx` | `listOrders()` on mount |
| Modify | `src/component/admin/management/ProductFormPanel.jsx` | File input for image upload |
| Modify | `src/component/admin/management/ProductCatalogPanel.jsx` | Adapt to API field names |
| Modify | `src/pages/admin/AdminManagement.jsx` | API-driven product CRUD |
| Modify | `src/pages/admin/AdminProducts.jsx` | `searchProducts(q)` on search |

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install runtime and dev dependencies**

```bash
npm install axios
npm install --save-dev vitest axios-mock-adapter
```

Expected: packages added to `package.json`, `node_modules` updated.

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest"
```

Result after edit (scripts section only):
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest"
}
```

- [ ] **Step 3: Add test config to vite.config.js**

Replace the entire contents of `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
  },
})
```

- [ ] **Step 4: Create the test directory**

```bash
mkdir -p src/services/api/__tests__
```

- [ ] **Step 5: Write a smoke test to verify Vitest works**

Create `src/services/api/__tests__/smoke.test.js`:

```js
import { describe, it, expect } from 'vitest'

describe('vitest smoke test', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the smoke test**

```bash
npm test -- --run
```

Expected output: `1 passed`

- [ ] **Step 7: Delete the smoke test file**

```bash
rm src/services/api/__tests__/smoke.test.js
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "chore: install axios and configure vitest"
```

---

## Task 2: Create axiosClients.js

**Files:**
- Create: `src/services/api/axiosClients.js`
- Create: `src/services/api/__tests__/axiosClients.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/services/api/__tests__/axiosClients.test.js`:

```js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import MockAdapter from 'axios-mock-adapter'

// We import after setting env so Vite replaces import.meta.env
// In Node (vitest/node env) import.meta.env is undefined — fall back to defaults
import { produtosClient, pedidosClient } from '../axiosClients.js'

describe('produtosClient', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(produtosClient)
  })

  afterEach(() => {
    mock.restore()
  })

  it('uses localhost:3000 as baseURL by default', () => {
    expect(produtosClient.defaults.baseURL).toBe('http://localhost:3000')
  })

  it('normalises error responses into Error with status and message', async () => {
    mock.onGet('/test').reply(404, { status: 'error', message: 'Not found' })

    let caught
    try {
      await produtosClient.get('/test')
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(Error)
    expect(caught.message).toBe('Not found')
    expect(caught.status).toBe(404)
    expect(caught.items).toBeNull()
  })

  it('attaches items array to error when present', async () => {
    mock.onGet('/test').reply(422, {
      status: 'error',
      message: 'Product validation failed',
      items: [{ id_product: 1, reason: 'not found' }],
    })

    let caught
    try {
      await produtosClient.get('/test')
    } catch (err) {
      caught = err
    }

    expect(caught.items).toHaveLength(1)
    expect(caught.items[0].id_product).toBe(1)
  })

  it('passes through successful responses unchanged', async () => {
    mock.onGet('/test').reply(200, { status: 'ok', data: { x: 1 }, message: null })
    const res = await produtosClient.get('/test')
    expect(res.data.data.x).toBe(1)
  })
})

describe('pedidosClient', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(pedidosClient)
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
    localStorage.clear()
  })

  it('uses localhost:3001 as baseURL by default', () => {
    expect(pedidosClient.defaults.baseURL).toBe('http://localhost:3001')
  })

  it('attaches Authorization header from localStorage when token present', async () => {
    localStorage.setItem('authToken', 'test-jwt-token')
    mock.onGet('/test').reply(200, { status: 'ok', data: {}, message: null })

    await pedidosClient.get('/test')

    expect(mock.history.get[0].headers['Authorization']).toBe('Bearer test-jwt-token')
  })

  it('makes request without Authorization header when no token in localStorage', async () => {
    mock.onGet('/test').reply(200, { status: 'ok', data: {}, message: null })

    await pedidosClient.get('/test')

    expect(mock.history.get[0].headers['Authorization']).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run
```

Expected: FAIL — `axiosClients.js` does not exist yet.

- [ ] **Step 3: Create src/services/api/axiosClients.js**

```js
import axios from 'axios'

const PRODUTOS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PRODUTOS_API_URL) ||
  'http://localhost:3000'

const PEDIDOS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PEDIDOS_API_URL) ||
  'http://localhost:3001'

function attachErrorInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status ?? 0
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error'
      const items = error.response?.data?.items ?? null
      return Promise.reject(Object.assign(new Error(message), { status, items }))
    }
  )
}

export const produtosClient = axios.create({ baseURL: PRODUTOS_BASE_URL })
attachErrorInterceptor(produtosClient)

export const pedidosClient = axios.create({ baseURL: PEDIDOS_BASE_URL })

pedidosClient.interceptors.request.use((config) => {
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null
  if (token) {
    config.headers = config.headers ?? {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

attachErrorInterceptor(pedidosClient)
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm test -- --run
```

Expected: all tests in `axiosClients.test.js` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/api/axiosClients.js src/services/api/__tests__/axiosClients.test.js
git commit -m "feat: add axios clients with error and auth interceptors"
```

---

## Task 3: Create products.js service

**Files:**
- Create: `src/services/api/products.js`
- Create: `src/services/api/__tests__/products.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/services/api/__tests__/products.test.js`:

```js
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { produtosClient } from '../axiosClients.js'
import {
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  listProductImages,
  deleteProductImage,
  getProductImageUrl,
} from '../products.js'

const mockProduct = {
  Idproduto: 108,
  Descricao: 'ALTO FALANTE 6" TRIAK',
  Marca: 'Hurricane',
  Num_fab: 'F01.201',
  idunidade: 'PAR',
  VLR_VENDA1: 67.9,
  descricao: 'Descrição do produto',
  estoque: 255,
}

let mock

beforeEach(() => {
  mock = new MockAdapter(produtosClient)
})

afterEach(() => {
  mock.restore()
})

describe('getProductImageUrl', () => {
  it('builds a full static URL from a filename', () => {
    const url = getProductImageUrl('abc-123.jpg')
    expect(url).toBe('http://localhost:3000/static/abc-123.jpg')
  })
})

describe('searchProducts', () => {
  it('returns the products array from the response', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [mockProduct] }, message: null })

    const result = await searchProducts('hurricane')
    expect(result).toHaveLength(1)
    expect(result[0].Idproduto).toBe(108)
  })

  it('sends q param', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [] }, message: null })

    await searchProducts('test')
    expect(mock.history.get[0].params.q).toBe('test')
  })

  it('sends limit param when provided', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [] }, message: null })

    await searchProducts('test', 10)
    expect(mock.history.get[0].params.limit).toBe(10)
  })

  it('throws normalized error on failure', async () => {
    mock.onGet('/api/products/search').reply(500, { status: 'error', message: 'DB error' })

    await expect(searchProducts('x')).rejects.toMatchObject({
      message: 'DB error',
      status: 500,
    })
  })
})

describe('getProduct', () => {
  it('returns the product object', async () => {
    mock
      .onGet('/api/products/108')
      .reply(200, { status: 'ok', data: { product: mockProduct }, message: null })

    const result = await getProduct(108)
    expect(result.Idproduto).toBe(108)
  })

  it('throws 404 error when product not found', async () => {
    mock
      .onGet('/api/products/999')
      .reply(404, { status: 'error', message: 'Product with ID 999 not found' })

    await expect(getProduct(999)).rejects.toMatchObject({ status: 404 })
  })
})

describe('createProduct', () => {
  it('posts to /api/products and returns the created product', async () => {
    const payload = { nome: 'Test', marca: 'Brand', unidade: 'PC', valor: 99.9, estoque: 10 }
    mock
      .onPost('/api/products')
      .reply(200, { status: 'ok', data: { product: mockProduct }, message: null })

    const result = await createProduct(payload)
    expect(result.Idproduto).toBe(108)
    expect(JSON.parse(mock.history.post[0].data)).toMatchObject(payload)
  })
})

describe('updateProduct', () => {
  it('patches the product and returns the updated product', async () => {
    mock
      .onPatch('/api/products/108')
      .reply(200, { status: 'ok', data: { product: { ...mockProduct, Descricao: 'Updated' } }, message: null })

    const result = await updateProduct(108, { nome: 'Updated' })
    expect(result.Descricao).toBe('Updated')
  })
})

describe('deleteProduct', () => {
  it('sends DELETE request and returns deleted product', async () => {
    mock
      .onDelete('/api/products/108')
      .reply(200, { status: 'success', data: { product: mockProduct }, message: null })

    const result = await deleteProduct(108)
    expect(result.Idproduto).toBe(108)
  })
})

describe('listProductImages', () => {
  it('returns images array', async () => {
    const mockImages = [{ id: 1, id_produto: 108, path: 'abc.jpg', created_at: '2026-01-01' }]
    mock
      .onGet('/api/products/108/imagens')
      .reply(200, { status: 'ok', data: { images: mockImages }, message: null })

    const result = await listProductImages(108)
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('abc.jpg')
  })
})

describe('deleteProductImage', () => {
  it('sends DELETE to the image endpoint', async () => {
    const mockImage = { id: 1, id_produto: 108, path: 'abc.jpg', created_at: '2026-01-01' }
    mock
      .onDelete('/api/products/108/imagens/1')
      .reply(200, { status: 'success', data: { image: mockImage }, message: null })

    const result = await deleteProductImage(108, 1)
    expect(result.id).toBe(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run
```

Expected: FAIL — `products.js` does not exist yet.

- [ ] **Step 3: Create src/services/api/products.js**

```js
import { produtosClient } from './axiosClients.js'

const PRODUTOS_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PRODUTOS_API_URL) ||
  'http://localhost:3000'

/**
 * Returns the full URL for a product image given its path (UUID filename).
 * @param {string} path - e.g. "3f2e1a4b-uuid.jpg"
 */
export function getProductImageUrl(path) {
  return `${PRODUTOS_BASE_URL}/static/${path}`
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
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm test -- --run
```

Expected: all tests in `products.test.js` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/api/products.js src/services/api/__tests__/products.test.js
git commit -m "feat: add products service with full CRUD and image management"
```

---

## Task 4: Create orders.js service

**Files:**
- Create: `src/services/api/orders.js`
- Create: `src/services/api/__tests__/orders.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/services/api/__tests__/orders.test.js`:

```js
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
  it('returns orders array', async () => {
    mock
      .onGet('/api/pedidos')
      .reply(200, { status: 'ok', data: { orders: [mockOrder] }, message: null })

    const result = await listOrders()
    expect(result).toHaveLength(1)
    expect(result[0].stat).toBe('processando')
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

describe('deleteOrder', () => {
  it('sends DELETE and returns deleted Order', async () => {
    mock
      .onDelete('/api/pedidos/42')
      .reply(200, { status: 'success', data: { order: mockOrder }, message: null })

    const result = await deleteOrder(42)
    expect(result.id).toBe(42)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- --run
```

Expected: FAIL — `orders.js` does not exist yet.

- [ ] **Step 3: Create src/services/api/orders.js**

```js
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
```

- [ ] **Step 4: Run all tests and verify they pass**

```bash
npm test -- --run
```

Expected: all tests across all 3 test files PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/api/orders.js src/services/api/__tests__/orders.test.js
git commit -m "feat: add orders service for pedidos-api"
```

---

## Task 5: Create AuthContext and .env.local

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `.env.local`

- [ ] **Step 1: Create the context directory**

```bash
mkdir -p src/context
```

- [ ] **Step 2: Create src/context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

/**
 * Provides JWT auth state to the app.
 * Persists the token in localStorage under "authToken".
 * The pedidos axios client reads the same key via its request interceptor.
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(
    () => localStorage.getItem('authToken')
  )

  /** Store token in state and localStorage. */
  const setToken = (t) => {
    localStorage.setItem('authToken', t)
    setTokenState(t)
  }

  /** Remove token from state and localStorage. */
  const clearToken = () => {
    localStorage.removeItem('authToken')
    setTokenState(null)
  }

  const isAuthenticated = token !== null

  return (
    <AuthContext.Provider value={{ token, setToken, clearToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to consume AuthContext. Must be called inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

- [ ] **Step 3: Create .env.local**

Create `.env.local` at the project root with the following content (replace `<paste-token-here>` with a real manually-minted JWT):

```
VITE_PRODUTOS_API_URL=http://localhost:3000
VITE_PEDIDOS_API_URL=http://localhost:3001
VITE_DEV_JWT_TOKEN=<paste-token-here>
```

- [ ] **Step 4: Verify .env.local is git-ignored**

```bash
grep -n "\.env\.local" .gitignore
```

Expected: a line matching `.env.local`. If absent, add it:

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 5: Commit**

```bash
git add src/context/AuthContext.jsx .gitignore
git commit -m "feat: add AuthContext for JWT lifecycle management"
```

---

## Task 6: Wire AuthProvider and fix routing

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Update src/main.jsx to wrap app in AuthProvider**

Replace the entire contents of `src/main.jsx` with:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Fix the /product route in src/App.jsx**

In `src/App.jsx`, replace:

```jsx
<Route path="/product" element={<ProductPage />}/>
```

with:

```jsx
<Route path="/product/:id" element={<ProductPage />}/>
```

- [ ] **Step 3: Verify the app starts without errors**

```bash
npm run dev
```

Navigate to `http://localhost:5173`. The app should load without console errors.

- [ ] **Step 4: Commit**

```bash
git add src/main.jsx src/App.jsx
git commit -m "feat: wrap app in AuthProvider, fix /product/:id route"
```

---

## Task 7: Persist Cart to localStorage and add clear()

**Files:**
- Modify: `src/services/Cart.jsx`

- [ ] **Step 1: Replace src/services/Cart.jsx with the persisted version**

```jsx
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
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. Add a product to the cart via the `+` button
3. Reload the page
4. Navigate to `/shoppingcart` — the item should still be there

- [ ] **Step 3: Commit**

```bash
git add src/services/Cart.jsx
git commit -m "feat: persist cart to localStorage, add clear()"
```

---

## Task 8: Update Login.jsx for mock auth

**Files:**
- Modify: `src/pages/Login.jsx`

- [ ] **Step 1: Update src/pages/Login.jsx**

Add the `useAuth` import and call `setToken` before navigating:

Replace:

```jsx
import { useState } from 'react'
import logo from '../assets/logo.jpeg'
import TextField from '../component/auth/TextField'
import PasswordField from '../component/auth/PasswordField'
import SocialLoginLink from '../component/auth/SocialLoginLink'
import SignInButton from '../component/auth/SignInButton'
import Link from '../component/auth/Link'
import { useNavigate } from 'react-router-dom'
```

with:

```jsx
import { useState } from 'react'
import logo from '../assets/logo.jpeg'
import TextField from '../component/auth/TextField'
import PasswordField from '../component/auth/PasswordField'
import SocialLoginLink from '../component/auth/SocialLoginLink'
import SignInButton from '../component/auth/SignInButton'
import Link from '../component/auth/Link'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
```

And replace:

```jsx
const navigate = useNavigate()
  const handleNavigateToHome = () => {
    navigate('/')
  }
```

with:

```jsx
const navigate = useNavigate()
  const { setToken } = useAuth()
  const handleNavigateToHome = () => {
    // SWAP POINT: replace the line below with a real auth API call when ready
    setToken(import.meta.env.VITE_DEV_JWT_TOKEN ?? '')
    navigate('/')
  }
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

1. Navigate to `http://localhost:5173/login`
2. Click "Entrar"
3. Open DevTools → Application → Local Storage → check `authToken` is set

- [ ] **Step 3: Commit**

```bash
git add src/pages/Login.jsx
git commit -m "feat: store dev JWT token on login (mock auth stub)"
```

---

## Task 9: Fix ProductCard and ProductSearchCard navigation

**Files:**
- Modify: `src/component/ProductCard/ProductCard.jsx`
- Modify: `src/component/ProductSearchCard/ProductSearchCard.jsx`

- [ ] **Step 1: Update ProductCard.jsx**

Replace:

```jsx
    const handleCardClick = (productId) => {
        navigate("/product")
        //navigate(`/product/?${productId}`)
    }
```

with:

```jsx
    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`)
    }
```

And replace every occurrence of `onClick={() => handleCardClick()}` with `onClick={() => handleCardClick(props.id)}`:

```jsx
            <div className="w-full flex-1 flex justify-center items-center"  onClick={() => handleCardClick(props.id)}>
```

```jsx
            <p className="font-extrabold text-base sm:text-lg text-deep-blue truncate"  onClick={() => handleCardClick(props.id)}>{props.productName}</p>
```

```jsx
                <p className="font-bold text-sm sm:text-base"  onClick={() => handleCardClick(props.id)}>{props.price}</p>
```

- [ ] **Step 2: Update ProductSearchCard.jsx**

Replace the entire contents of `src/component/ProductSearchCard/ProductSearchCard.jsx`:

```jsx
import { useNavigate } from "react-router-dom"
import CardButton from "../CardButton/CardButton"

const ProductSearchCard = (props) => {
    const navigate = useNavigate()

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    return (
        <div className="w-full h-auto flex flex-col md:flex-row justify-start shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] rounded-xl p-3 gap-3 md:gap-4">
            <div
                className="w-full md:w-2/5 flex justify-center items-center bg-light-gray rounded-md p-4"
                onClick={() => handleCardClick(props.id)}
            >
                {props.imageUrl ? (
                    <img
                        src={props.imageUrl}
                        alt={props.imageAlt}
                        className="w-full max-w-[200px] h-auto object-contain"
                    />
                ) : (
                    <div className="w-full max-w-[200px] h-24 flex items-center justify-center text-gray text-xs">
                        Sem imagem
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-row md:flex-col justify-between items-start md:items-start w-full gap-2">
                    <div className="flex-1" onClick={() => handleCardClick(props.id)}>
                        <h1 className="font-extrabold text-base md:text-md">{props.productName}</h1>
                        <p className="font-bold text-base md:text-md text-deep-blue mt-1">{props.price}</p>
                    </div>
                    <CardButton className="self-center md:self-auto" productId={props.id} />
                </div>
            </div>
        </div>
    )
}

export default ProductSearchCard
```

- [ ] **Step 3: Commit**

```bash
git add src/component/ProductCard/ProductCard.jsx src/component/ProductSearchCard/ProductSearchCard.jsx
git commit -m "fix: navigate to /product/:id instead of /product"
```

---

## Task 10: Update SearchBar and SearchPage

**Files:**
- Modify: `src/component/SearchBar/SearchBar.jsx`
- Modify: `src/pages/SearchPage.jsx`

- [ ] **Step 1: Update SearchBar to accept an onSearch callback**

Replace the entire contents of `src/component/SearchBar/SearchBar.jsx` with:

```jsx
import { useState } from "react"
import { LuSearch } from "react-icons/lu"

/**
 * Search input component.
 * @param {{ onSearch?: (query: string) => void }} props
 */
const SearchBar = ({ onSearch }) => {
    const [text, setText] = useState("")

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
            if (onSearch) onSearch(text.trim())
        }
    }

    return (
        <div className="relative w-full mt-3">
            <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full h-12 md:h-14 p-4 pl-12 md:pl-14 bg-light-gray text-dark-gray border-2 border-dark-gray rounded-3xl focus:border-deep-blue focus:ring-2 focus:ring-deep-blue/20 outline-none transition-all duration-300 text-base md:text-md shadow-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <LuSearch className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-xl md:text-2xl stroke-dark-gray pointer-events-none" />
        </div>
    )
}

export default SearchBar
```

- [ ] **Step 2: Replace src/pages/SearchPage.jsx with the API-connected version**

```jsx
import { useState } from "react"
import NavBar from "../component/NavBar/NavBar"
import ProductSearchCard from "../component/ProductSearchCard/ProductSearchCard"
import SearchBar from "../component/SearchBar/SearchBar"
import Header from "../component/Header/Header"
import BannerNav from "../component/NavBar/BannerNav"
import { searchProducts } from "../services/api/products"

const SearchPage = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (query) => {
        if (!query) return
        setLoading(true)
        setError(null)
        setHasSearched(true)
        try {
            const products = await searchProducts(query)
            setResults(products)
        } catch (err) {
            setError(err.message ?? "Erro ao buscar produtos.")
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="p-5 h-[100dvh] flex flex-col overflow-hidden w-full">
                <Header />
                <BannerNav />
                <SearchBar onSearch={handleSearch} />

                {loading && (
                    <p className="mt-6 text-center text-sm text-gray">Buscando...</p>
                )}

                {error && (
                    <p className="mt-6 text-center text-sm text-red">{error}</p>
                )}

                {!loading && hasSearched && results.length === 0 && !error && (
                    <p className="mt-6 text-center text-sm text-gray">Nenhum produto encontrado.</p>
                )}

                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 w-full mt-4 flex-1 overflow-y-auto pb-20">
                        {results.map((product) => (
                            <ProductSearchCard
                                key={product.Idproduto}
                                id={product.Idproduto}
                                productName={product.Descricao}
                                price={`R$ ${parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                imageUrl={null}
                                imageAlt={product.Descricao}
                            />
                        ))}
                    </div>
                )}
            </div>
            <NavBar />
        </>
    )
}

export default SearchPage
```

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

1. Navigate to `http://localhost:5173/search`
2. Type a product name and press Enter
3. Verify real results appear (requires `produtos-api` running on port 3000)
4. Search for something that returns no results — verify "Nenhum produto encontrado." message appears

- [ ] **Step 4: Commit**

```bash
git add src/component/SearchBar/SearchBar.jsx src/pages/SearchPage.jsx
git commit -m "feat: wire SearchPage to produtos-api search endpoint"
```

---

## Task 11: Update ProductPage

**Files:**
- Modify: `src/pages/ProductPage.jsx`

- [ ] **Step 1: Replace src/pages/ProductPage.jsx**

```jsx
import { useEffect, useState } from "react"
import { LuArrowLeft, LuShoppingCart } from "react-icons/lu"
import { useNavigate, useParams } from "react-router-dom"
import CardButton from "../component/CardButton/CardButton"
import logo from "../assets/logo.jpeg"
import BannerNav from "../component/NavBar/BannerNav"
import Navbar from "../component/NavBar/NavBar"
import { getProduct, listProductImages, getProductImageUrl } from "../services/api/products"

const ProductPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const [prod, imgs] = await Promise.all([
                    getProduct(id),
                    listProductImages(id),
                ])
                setProduct(prod)
                setImages(imgs)
            } catch (err) {
                setError(err.message ?? "Produto não encontrado.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    const handleBack = () => navigate(-1)

    const primaryImageUrl =
        images.length > 0 ? getProductImageUrl(images[0].path) : null

    return (
        <div className="flex flex-col justify-center">
            <header className="grid grid-cols-3 items-center px-4 py-2">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={handleBack}
                    className="justify-self-start inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
                <div className="justify-self-center flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain" />
                </div>
                <button
                    type="button"
                    aria-label="Carrinho"
                    className="justify-self-end inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
            </header>

            <BannerNav />

            {loading && (
                <p className="p-10 text-center text-gray">Carregando produto...</p>
            )}

            {error && (
                <p className="p-10 text-center text-red">{error}</p>
            )}

            {!loading && !error && product && (
                <section className="flex flex-col p-5">
                    <h1 className="text-3xl font-extrabold">{product.Descricao}</h1>
                    <div className="w-full h-full bg-light-gray p-5 rounded mt-3 flex justify-center">
                        {primaryImageUrl ? (
                            <img
                                src={primaryImageUrl}
                                alt={product.Descricao}
                                className="rounded max-h-64 object-contain"
                            />
                        ) : (
                            <div className="w-full h-40 flex items-center justify-center text-gray text-sm">
                                Sem imagem
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-around gap-3 mt-5">
                        <h2 className="text-4xl font-bold">
                            Por: R${parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>
                        <CardButton className="self-center" productId={product.Idproduto} />
                    </div>
                    <div className="mt-5 rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-3">
                        <h2 className="font-bold text-xl">Marca</h2>
                        <p className="text-lg">{product.Marca}</p>
                        {product.Num_fab && (
                            <>
                                <h2 className="mt-5 font-bold text-xl">Referência</h2>
                                <p className="text-lg">{product.Num_fab}</p>
                            </>
                        )}
                        {product.descricao && (
                            <>
                                <h2 className="mt-5 font-bold text-xl">Descrição</h2>
                                <p className="text-lg">{product.descricao}</p>
                            </>
                        )}
                        <h2 className="mt-5 font-bold text-xl">Estoque</h2>
                        <p className="text-lg">{product.estoque} {product.idunidade}</p>
                    </div>
                </section>
            )}

            <Navbar />
        </div>
    )
}

export default ProductPage
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

1. Search for a product, click on a result — should navigate to `/product/:id`
2. Verify product name, brand, price and image render correctly
3. Navigate to a non-existent ID (e.g. `/product/999999`) — should show the error message

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProductPage.jsx
git commit -m "feat: wire ProductPage to produtos-api using route param :id"
```

---

## Task 12: Update CheckoutReviewPage

**Files:**
- Modify: `src/pages/checkout/CheckoutReviewPage.jsx`

- [ ] **Step 1: Replace src/pages/checkout/CheckoutReviewPage.jsx**

```jsx
import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../../component/GeneralButton/Button"
import Header from "../../component/Header/Header"
import Alert from "../../component/Alert/Alert"
import { cart } from "../../services/Cart"
import { getProduct } from "../../services/api/products"
import { createOrder } from "../../services/api/orders"

const CheckoutReviewPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const checkoutState = location.state ?? {}

    const selectedAddress = checkoutState.address
    const paymentMethod = checkoutState.paymentMethod ?? "pix"
    const cardBrand = checkoutState.cardBrand ?? "Cartão"
    const cardLast4 = checkoutState.cardLast4 ?? "0000"

    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderError, setOrderError] = useState(null)
    const [alertVisible, setAlertVisible] = useState(false)

    useEffect(() => {
        const loadItems = async () => {
            const items = cart.getItems()
            const resolved = await Promise.all(
                items.map(async (item) => {
                    try {
                        const product = await getProduct(item.id)
                        return {
                            id: product.Idproduto,
                            name: product.Descricao,
                            price: parseFloat(product.VLR_VENDA1),
                            quantity: item.number,
                            subtotal: parseFloat(product.VLR_VENDA1) * item.number,
                        }
                    } catch {
                        return null
                    }
                })
            )
            const valid = resolved.filter(Boolean)
            setCartItems(valid)
            setTotal(valid.reduce((sum, item) => sum + item.subtotal, 0))
            setLoading(false)
        }
        loadItems()
    }, [])

    const paymentLabel =
        paymentMethod === "card" ? `${cardBrand} final ${cardLast4}` : "Pix"

    const formatCurrency = (value) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

    const handleFinishOrder = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        setOrderError(null)
        try {
            const items = cart.getItems().map((item) => ({
                id_product: item.id,
                quantity: item.number,
            }))
            await createOrder({ items })
            cart.clear()
            navigate("/account/orders")
        } catch (err) {
            const message = err.items
                ? `${err.message}: ${err.items.map((i) => `Produto #${i.id_product} — ${i.reason}`).join("; ")}`
                : (err.message ?? "Erro ao finalizar pedido.")
            setOrderError(message)
            setAlertVisible(true)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-slate-50">
            <Header showBackButton backTo="/checkout/payment" showCartButton={false} />
            <main className="flex-1 px-4 py-5 pb-10">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Checkout</p>
                        <h1 className="text-2xl font-extrabold text-deep-blue">Finalizar pedido</h1>
                        <p className="text-sm text-gray">Confira os dados do pedido antes de concluir.</p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Itens do carrinho</h2>
                        {loading ? (
                            <p className="mt-2 text-sm text-gray">Carregando itens...</p>
                        ) : cartItems.length > 0 ? (
                            <div className="mt-3 flex flex-col gap-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-bold text-deep-blue">{item.name}</p>
                                                <p className="text-sm text-gray">Qtd: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-deep-blue">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-gray">Seu carrinho está vazio.</p>
                        )}
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Endereço de entrega</h2>
                        <p className="mt-2 text-sm text-gray">
                            {selectedAddress
                                ? `${selectedAddress.name} — ${selectedAddress.street}, ${selectedAddress.number} — ${selectedAddress.city}/${selectedAddress.state}`
                                : "Endereço não informado."}
                        </p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Método de pagamento</h2>
                        <p className="mt-2 text-sm text-gray">{paymentLabel}</p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray">Total do pedido</p>
                            <p className="text-xl font-extrabold text-deep-blue">{formatCurrency(total)}</p>
                        </div>
                    </section>

                    <Button
                        onClick={handleFinishOrder}
                        bg_color="bg-orange"
                        text={isSubmitting ? "Enviando..." : "Finalizar pedido"}
                    />
                </div>
            </main>

            <Alert
                isVisible={alertVisible}
                message={orderError ?? ""}
                duration={6000}
                onClose={() => setAlertVisible(false)}
            />
        </div>
    )
}

export default CheckoutReviewPage
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

1. Add products to the cart, go through checkout to the review page
2. Products should load with real names and prices from the API
3. Click "Finalizar pedido" — order should be created and redirect to `/account/orders`
4. If the JWT is invalid/missing, an error alert should appear

- [ ] **Step 3: Commit**

```bash
git add src/pages/checkout/CheckoutReviewPage.jsx
git commit -m "feat: wire CheckoutReviewPage to pedidos-api createOrder"
```

---

## Task 13: Update OrderBlock, Orders page, and AccountOrdersPanel

**Files:**
- Modify: `src/component/Orders/OrderBlock.jsx`
- Modify: `src/pages/account/Orders.jsx`
- Modify: `src/component/AccountPanels/AccountOrdersPanel.jsx`

- [ ] **Step 1: Replace src/component/Orders/OrderBlock.jsx**

The new component accepts an `order` object (lightweight API Order) and lazily fetches
the full detail (`CompleteOrder`) when expanded.

```jsx
import { useState } from "react"
import { LuCirclePlus, LuCircleMinus } from "react-icons/lu"
import { getOrder } from "../../services/api/orders"

const STATUS_LABELS = {
  processando: "Processando",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
  rejeitado: "Rejeitado",
}

const STATUS_COLORS = {
  processando: "bg-light-blue",
  confirmado: "bg-blue",
  enviado: "bg-yellow",
  entregue: "bg-green",
  cancelado: "bg-red",
  rejeitado: "bg-red",
}

const OrderBlock = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const handleToggle = async () => {
    const next = !expanded
    setExpanded(next)
    if (next && !detail) {
      setLoadingDetail(true)
      try {
        const completeOrder = await getOrder(order.id)
        setDetail(completeOrder)
      } catch {
        // order detail failed to load — user can retry by collapsing and expanding
      } finally {
        setLoadingDetail(false)
      }
    }
  }

  const label = STATUS_LABELS[order.stat] ?? order.stat
  const colorClass = STATUS_COLORS[order.stat] ?? "bg-gray"
  const orderDate = new Date(order.created_at).toLocaleDateString("pt-BR")

  const formatCurrency = (value) =>
    parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })

  return (
    <div className="rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-4 bg-full-white">
      <div>
        <span className={`${colorClass} text-full-white text-xs font-bold px-3 py-1 rounded`}>
          {label}
        </span>
      </div>
      <div className="flex gap-2 mt-2 divide-x border-b pb-2">
        <p className="text-sm font-light text-gray text-left w-28">Data: {orderDate}</p>
        <p className="text-sm font-light text-gray text-right pl-2">Pedido: #{order.id}</p>
        <button
          className="border-none ml-auto"
          type="button"
          title={expanded ? "Ver menos" : "Ver mais"}
          aria-label={expanded ? "Ver menos" : "Ver mais"}
          onClick={handleToggle}
        >
          <div className={`transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-90"}`}>
            {expanded ? (
              <LuCircleMinus className="text-2xl text-gray cursor-pointer ml-auto" />
            ) : (
              <LuCirclePlus className="text-2xl text-gray cursor-pointer ml-auto" />
            )}
          </div>
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        {loadingDetail && (
          <p className="py-4 text-sm text-gray text-center">Carregando itens...</p>
        )}
        {!loadingDetail && detail && (
          <>
            {detail.items.map((item) => (
              <div key={item.id} className="flex flex-row items-center justify-between gap-3 py-3 border-b border-gray/10 last:border-0">
                <div className="flex flex-col">
                  <p className="font-bold text-deep-blue">Produto #{item.id_product}</p>
                  <p className="text-sm text-gray">Qtd: {item.quantity}</p>
                </div>
                <p className="font-bold">{formatCurrency(item.unit_price * item.quantity)}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="pt-2">
        {detail ? (
          <p className="font-bold text-right ml-auto">Total: {formatCurrency(detail.total)}</p>
        ) : (
          <p className="text-sm text-gray text-right">Expanda para ver o total</p>
        )}
      </div>
    </div>
  )
}

export default OrderBlock
```

- [ ] **Step 2: Replace src/pages/account/Orders.jsx**

```jsx
import { useEffect, useState } from "react"
import OrderBlock from "../../component/Orders/OrderBlock"
import Header from "../../component/Header/Header"
import NavBar from "../../component/NavBar/NavBar"
import { listOrders } from "../../services/api/orders"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((err) => setError(err.message ?? "Erro ao carregar pedidos."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <Header showBackButton={true} />
      <h1 className="text-xl font-bold text-center text-deep-blue mb-4">Meus Pedidos</h1>
      <div className="flex flex-col gap-4 px-4 pb-24">
        {loading && <p className="text-center text-sm text-gray">Carregando pedidos...</p>}
        {error && <p className="text-center text-sm text-red">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-sm text-gray">Nenhum pedido encontrado.</p>
        )}
        {orders.map((order) => (
          <OrderBlock key={order.id} order={order} />
        ))}
      </div>
      <NavBar />
    </div>
  )
}

export default Orders
```

- [ ] **Step 3: Replace src/component/AccountPanels/AccountOrdersPanel.jsx**

```jsx
import { useEffect, useState } from "react"
import OrderBlock from "../../component/Orders/OrderBlock"
import { listOrders } from "../../services/api/orders"

const AccountOrdersPanel = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((err) => setError(err.message ?? "Erro ao carregar pedidos."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-full-white rounded-xl p-4 shadow-sm">
        <h2 className="text-xl font-extrabold text-deep-blue mb-4">Meus Pedidos</h2>
        {loading && <p className="text-sm text-gray">Carregando pedidos...</p>}
        {error && <p className="text-sm text-red">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-gray">Nenhum pedido encontrado.</p>
        )}
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderBlock key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccountOrdersPanel
```

- [ ] **Step 4: Manual verification**

```bash
npm run dev
```

1. Log in, navigate to `/account/orders`
2. Orders should load from the API (requires valid JWT and `pedidos-api` running)
3. Click the expand button on an order — items and total should load
4. Orders without a JWT should show an error message

- [ ] **Step 5: Commit**

```bash
git add src/component/Orders/OrderBlock.jsx src/pages/account/Orders.jsx src/component/AccountPanels/AccountOrdersPanel.jsx
git commit -m "feat: wire orders list and detail to pedidos-api"
```

---

## Task 14: Admin product CRUD — managementUtils, ProductFormPanel, ProductCatalogPanel, AdminManagement

**Files:**
- Modify: `src/component/admin/management/managementUtils.js`
- Modify: `src/component/admin/management/ProductFormPanel.jsx`
- Modify: `src/component/admin/management/ProductCatalogPanel.jsx`
- Modify: `src/pages/admin/AdminManagement.jsx`

- [ ] **Step 1: Update managementUtils.js**

Replace the entire contents of `src/component/admin/management/managementUtils.js`:

```js
export const createEmptyProductForm = () => ({
    name: "",
    sku: "",
    brand: "",
    manufacturer: "",
    retailPrice: "",
    wholesalePrice: "",
    promoPrice: "",
    quantity: "",
    category: "",
    description: "",
    unidade: "PC",
})

export const getUniqueValues = (items, mapper) => {
    return Array.from(new Set(items.map(mapper).filter(Boolean)))
}

export const mergeUniqueValues = (currentValues, nextValues) => {
    return Array.from(new Set([...currentValues, ...nextValues].filter(Boolean)))
}

/** Build payload for the mock in-memory catalog (legacy — used by AdminManagement state). */
export const buildProductPayload = (formData, images, compatibleCars, productId) => ({
    id: productId ?? Date.now(),
    name: formData.name,
    sku: formData.sku,
    price: Number(formData.retailPrice),
    wholesalePrice: Number(formData.wholesalePrice),
    promoPrice: Number(formData.promoPrice),
    quantity: Number(formData.quantity),
    category: formData.category,
    brand: formData.brand,
    manufacturer: formData.manufacturer,
    images: images.length > 0 ? images : [],
    compatibleCars,
    description: formData.description,
})

/**
 * Build the request body for POST /api/products or PATCH /api/products/:id.
 * Maps form fields to the API's snake_case naming.
 */
export const buildApiProductPayload = (formData) => ({
    nome: formData.name,
    marca: formData.brand,
    num_fab: formData.sku || undefined,
    unidade: formData.unidade || "PC",
    valor: parseFloat(formData.retailPrice),
    descricao: formData.description || undefined,
    estoque: parseInt(formData.quantity, 10) || 0,
})

/**
 * Map an API Product object (legacy CSV field names) into the form data shape.
 */
export const loadApiProductIntoForm = (product) => ({
    name: product.Descricao,
    sku: product.Num_fab ?? "",
    brand: product.Marca,
    manufacturer: "",
    retailPrice: String(product.VLR_VENDA1),
    wholesalePrice: "",
    promoPrice: "",
    quantity: String(product.estoque),
    category: "",
    description: product.descricao ?? "",
    unidade: product.idunidade ?? "PC",
})
```

- [ ] **Step 2: Update ProductFormPanel.jsx to add a file input**

In `src/component/admin/management/ProductFormPanel.jsx`, add `imageFile` and `onImageFileChange` props and render a file input instead of the URL text field. Replace the two image-related `AdminInput` + `AdminInput` cells in the grid:

Find:

```jsx
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <AdminInput
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={onChange}
                        placeholder="Estoque"
                    />
                    <AdminInput
                        value={imageDraft}
                        onChange={onImageDraftChange}
                        placeholder="Adicionar URL da imagem"
                    />
                </div>
```

Replace with:

```jsx
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <AdminInput
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={onChange}
                        placeholder="Estoque"
                    />
                    <AdminInput
                        name="unidade"
                        value={formData.unidade}
                        onChange={onChange}
                        placeholder="Unidade (PC, PAR, KT...)"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-deep-blue">Imagem do produto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageFileChange}
                        className="text-sm text-dark-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-light-gray file:text-deep-blue hover:file:bg-gray/20"
                    />
                    {imageFile && (
                        <p className="text-xs text-gray">Selecionado: {imageFile.name}</p>
                    )}
                </div>
```

Also add `imageFile` and `onImageFileChange` to the component's props destructuring at the top of the component:

Find:

```jsx
const ProductFormPanel = ({
    title,
    description,
    formTopSlot,
    formData,
    onChange,
    categoryOptions,
    imageDraft,
    onImageDraftChange,
    onAddImage,
    images,
    onRemoveImage,
    carOptions,
    selectedCar,
    onSelectedCarChange,
    onAddCar,
    cars,
    onRemoveCar,
    onSubmit,
    submitLabel,
    secondaryAction,
}) => {
```

Replace with:

```jsx
const ProductFormPanel = ({
    title,
    description,
    formTopSlot,
    formData,
    onChange,
    categoryOptions,
    imageDraft,
    onImageDraftChange,
    onAddImage,
    images,
    onRemoveImage,
    imageFile,
    onImageFileChange,
    carOptions,
    selectedCar,
    onSelectedCarChange,
    onAddCar,
    cars,
    onRemoveCar,
    onSubmit,
    submitLabel,
    secondaryAction,
}) => {
```

- [ ] **Step 3: Update ProductCatalogPanel.jsx to use API field names**

Replace the entire contents of `src/component/admin/management/ProductCatalogPanel.jsx`:

```jsx
import { getProductImageUrl } from "../../../services/api/products"

const ProductCatalogPanel = ({ products, totalStockValue, onEdit, onDelete }) => {
    return (
        <div className="rounded-xl bg-full-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray/10 pb-4">
                <h2 className="text-lg font-bold text-deep-blue">Catálogo atual</h2>
                <p className="mt-1 text-sm text-gray">Os itens abaixo alimentam as listas de edição.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                    const productId = product.Idproduto
                    const name = product.Descricao
                    const brand = product.Marca
                    const price = parseFloat(product.VLR_VENDA1)
                    const stock = product.estoque
                    const unit = product.idunidade
                    const firstImage = product._images?.[0]

                    return (
                        <article key={productId} className="rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                            <div className="flex items-start gap-3">
                                {firstImage ? (
                                    <img
                                        src={getProductImageUrl(firstImage.path)}
                                        alt={name}
                                        className="h-16 w-16 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-xl bg-light-gray flex items-center justify-center text-xs text-gray">
                                        Sem img
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-deep-blue">{name}</p>
                                    <p className="text-sm text-gray">{brand}</p>
                                    <p className="text-xs text-gray">{unit}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray">Preço</p>
                                    <p className="font-semibold text-deep-blue">
                                        R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray">Estoque</p>
                                    <p className="font-semibold text-deep-blue">{stock}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(product)}
                                    className="flex-1 rounded-lg border border-deep-blue px-3 py-2 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(productId)}
                                    className="rounded-lg border border-red px-3 py-2 text-sm font-semibold text-red transition hover:bg-red/10"
                                >
                                    Excluir
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Itens no catálogo</p>
                    <p className="text-2xl font-extrabold text-deep-blue">{products.length}</p>
                </div>
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Valor em estoque</p>
                    <p className="text-2xl font-extrabold text-deep-blue">
                        R$ {totalStockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductCatalogPanel
```

- [ ] **Step 4: Replace AdminManagement.jsx with the API-driven version**

Replace the entire contents of `src/pages/admin/AdminManagement.jsx`:

```jsx
import { useCallback, useEffect, useMemo, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminSelect from "../../component/admin/forms/AdminSelect"
import GeneralTaxonomyPanel from "../../component/admin/management/GeneralTaxonomyPanel"
import ManagementTabs from "../../component/admin/management/ManagementTabs"
import ProductCatalogPanel from "../../component/admin/management/ProductCatalogPanel"
import ProductFormPanel from "../../component/admin/management/ProductFormPanel"
import {
    buildApiProductPayload,
    createEmptyProductForm,
    getUniqueValues,
    loadApiProductIntoForm,
    mergeUniqueValues,
} from "../../component/admin/management/managementUtils"
import {
    createProduct,
    deleteProduct,
    searchProducts,
    updateProduct,
    uploadProductImage,
} from "../../services/api/products"

const AdminManagement = () => {
    const [activeSection, setActiveSection] = useState("management")
    const [activeTab, setActiveTab] = useState("create")
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [apiError, setApiError] = useState(null)

    const [categoryOptions, setCategoryOptions] = useState([])
    const [carOptions, setCarOptions] = useState([])

    const [createForm, setCreateForm] = useState(createEmptyProductForm())
    const [createFile, setCreateFile] = useState(null)
    const [editForm, setEditForm] = useState(createEmptyProductForm())
    const [editFile, setEditFile] = useState(null)
    const [selectedProductId, setSelectedProductId] = useState(null)

    const [createCars, setCreateCars] = useState([])
    const [editCars, setEditCars] = useState([])
    const [selectedCreateCar, setSelectedCreateCar] = useState("")
    const [selectedEditCar, setSelectedEditCar] = useState("")
    const [newCategoryDraft, setNewCategoryDraft] = useState("")
    const [newCarDraft, setNewCarDraft] = useState("")

    const loadProducts = useCallback(async () => {
        setLoadingProducts(true)
        setApiError(null)
        try {
            const data = await searchProducts("")
            setProducts(data)
        } catch (err) {
            setApiError(err.message ?? "Erro ao carregar produtos.")
        } finally {
            setLoadingProducts(false)
        }
    }, [])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const totalStockValue = useMemo(() => {
        return products.reduce(
            (sum, p) => sum + parseFloat(p.VLR_VENDA1) * p.estoque,
            0
        )
    }, [products])

    const selectedProduct = useMemo(
        () => products.find((p) => p.Idproduto === selectedProductId) ?? null,
        [products, selectedProductId]
    )

    const updateSelectedProductForm = (product) => {
        if (!product) return
        setSelectedProductId(product.Idproduto)
        setEditForm(loadApiProductIntoForm(product))
        setEditCars([])
        setSelectedEditCar("")
        setEditFile(null)
    }

    const addUniqueItem = (value, setter) => {
        const next = value.trim()
        if (!next) return
        setter((current) => (current.includes(next) ? current : [...current, next]))
    }

    const removeItem = (value, setter) => {
        setter((current) => current.filter((item) => item !== value))
    }

    const handleCreateChange = (event) => {
        const { name, value } = event.target
        setCreateForm((current) => ({ ...current, [name]: value }))
    }

    const handleEditChange = (event) => {
        const { name, value } = event.target
        setEditForm((current) => ({ ...current, [name]: value }))
    }

    const handleCreateSubmit = async (event) => {
        event.preventDefault()
        setApiError(null)
        try {
            const payload = buildApiProductPayload(createForm)
            const newProduct = await createProduct(payload)
            if (createFile) {
                await uploadProductImage(newProduct.Idproduto, createFile)
            }
            await loadProducts()
            setCreateForm(createEmptyProductForm())
            setCreateFile(null)
            setCreateCars([])
            setSelectedCreateCar("")
        } catch (err) {
            setApiError(err.message ?? "Erro ao criar produto.")
        }
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault()
        if (!selectedProduct) return
        setApiError(null)
        try {
            const payload = buildApiProductPayload(editForm)
            await updateProduct(selectedProduct.Idproduto, payload)
            if (editFile) {
                await uploadProductImage(selectedProduct.Idproduto, editFile)
            }
            await loadProducts()
            setEditFile(null)
        } catch (err) {
            setApiError(err.message ?? "Erro ao atualizar produto.")
        }
    }

    const handleDelete = async (productId) => {
        setApiError(null)
        try {
            await deleteProduct(productId)
            await loadProducts()
            if (selectedProductId === productId) {
                setSelectedProductId(null)
                setEditForm(createEmptyProductForm())
            }
        } catch (err) {
            setApiError(err.message ?? "Erro ao excluir produto.")
        }
    }

    const addCategoryOption = () => {
        const next = newCategoryDraft.trim()
        if (!next) { setNewCategoryDraft(""); return }
        setCategoryOptions((current) => mergeUniqueValues(current, [next]))
        setNewCategoryDraft("")
    }

    const addCarOption = () => {
        const next = newCarDraft.trim()
        if (!next) { setNewCarDraft(""); return }
        setCarOptions((current) => mergeUniqueValues(current, [next]))
        setNewCarDraft("")
    }

    const handleCatalogEdit = (product) => {
        updateSelectedProductForm(product)
        setActiveTab("edit")
    }

    const editSelector = (
        <AdminSelect
            value={selectedProductId ?? ""}
            onChange={(event) => {
                const p = products.find((p) => p.Idproduto === Number(event.target.value)) ?? null
                updateSelectedProductForm(p)
            }}
            disabled={products.length === 0}
        >
            {products.length === 0 ? (
                <option value="">Sem produtos cadastrados</option>
            ) : (
                products.map((product) => (
                    <option key={product.Idproduto} value={product.Idproduto}>
                        {product.Descricao} — {product.Marca}
                    </option>
                ))
            )}
        </AdminSelect>
    )

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Gerenciar produtos"
                    description="Crie, edite e exclua produtos do catálogo."
                />

                {apiError && (
                    <div className="rounded-xl bg-red/10 border border-red px-4 py-3 text-sm text-red font-semibold">
                        {apiError}
                    </div>
                )}

                {loadingProducts && (
                    <p className="text-sm text-gray text-center">Carregando catálogo...</p>
                )}

                <ManagementTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="space-y-6">
                    {activeTab === "create" && (
                        <ProductFormPanel
                            title="Novo produto"
                            description="Preencha os campos e salve para criar o produto via API."
                            formData={createForm}
                            onChange={handleCreateChange}
                            categoryOptions={categoryOptions}
                            imageDraft=""
                            onImageDraftChange={() => {}}
                            onAddImage={() => {}}
                            images={[]}
                            onRemoveImage={() => {}}
                            imageFile={createFile}
                            onImageFileChange={(e) => setCreateFile(e.target.files[0] ?? null)}
                            carOptions={carOptions}
                            selectedCar={selectedCreateCar}
                            onSelectedCarChange={setSelectedCreateCar}
                            onAddCar={() => {
                                addUniqueItem(selectedCreateCar, setCreateCars)
                                setSelectedCreateCar("")
                            }}
                            cars={createCars}
                            onRemoveCar={(car) => removeItem(car, setCreateCars)}
                            onSubmit={handleCreateSubmit}
                            submitLabel="Adicionar produto"
                        />
                    )}

                    {activeTab === "edit" && (
                        <ProductFormPanel
                            title="Editar produto existente"
                            description="Escolha um produto e edite seus dados."
                            formTopSlot={editSelector}
                            formData={editForm}
                            onChange={handleEditChange}
                            categoryOptions={categoryOptions}
                            imageDraft=""
                            onImageDraftChange={() => {}}
                            onAddImage={() => {}}
                            images={[]}
                            onRemoveImage={() => {}}
                            imageFile={editFile}
                            onImageFileChange={(e) => setEditFile(e.target.files[0] ?? null)}
                            carOptions={carOptions}
                            selectedCar={selectedEditCar}
                            onSelectedCarChange={setSelectedEditCar}
                            onAddCar={() => {
                                addUniqueItem(selectedEditCar, setEditCars)
                                setSelectedEditCar("")
                            }}
                            cars={editCars}
                            onRemoveCar={(car) => removeItem(car, setEditCars)}
                            onSubmit={handleEditSubmit}
                            submitLabel="Salvar alterações"
                            secondaryAction={{
                                label: "Reverter",
                                onClick: () => updateSelectedProductForm(selectedProduct),
                            }}
                        />
                    )}

                    {activeTab === "general" && (
                        <GeneralTaxonomyPanel
                            categories={categoryOptions}
                            cars={carOptions}
                            newCategoryDraft={newCategoryDraft}
                            onCategoryDraftChange={(event) => setNewCategoryDraft(event.target.value)}
                            onAddCategory={addCategoryOption}
                            newCarDraft={newCarDraft}
                            onCarDraftChange={(event) => setNewCarDraft(event.target.value)}
                            onAddCar={addCarOption}
                        />
                    )}
                </div>

                {!loadingProducts && (
                    <ProductCatalogPanel
                        products={products}
                        totalStockValue={totalStockValue}
                        onEdit={handleCatalogEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminManagement
```

- [ ] **Step 5: Manual verification**

```bash
npm run dev
```

Set `localStorage.adminRole = "admin"` in DevTools console, then navigate to `http://localhost:5173/admin/management`:

1. Product catalog should load from `produtos-api`
2. Create tab: fill in name, brand, price, stock, unit → click "Adicionar produto" → product appears in catalog
3. Edit tab: select a product → modify a field → click "Salvar alterações" → catalog updates
4. Delete: click "Excluir" on a catalog item → product disappears

- [ ] **Step 6: Commit**

```bash
git add src/component/admin/management/managementUtils.js src/component/admin/management/ProductFormPanel.jsx src/component/admin/management/ProductCatalogPanel.jsx src/pages/admin/AdminManagement.jsx
git commit -m "feat: wire AdminManagement CRUD to produtos-api"
```

---

## Task 15: Update AdminProducts

**Files:**
- Modify: `src/pages/admin/AdminProducts.jsx`

- [ ] **Step 1: Replace src/pages/admin/AdminProducts.jsx**

```jsx
import { useEffect, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminInput from "../../component/admin/forms/AdminInput"
import { searchProducts } from "../../services/api/products"

const AdminProducts = () => {
    const [activeSection, setActiveSection] = useState("products")
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProducts = async (query) => {
        setLoading(true)
        setError(null)
        try {
            const data = await searchProducts(query)
            setProducts(data)
        } catch (err) {
            setError(err.message ?? "Erro ao carregar produtos.")
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchProducts("")
    }, [])

    const handleSearchChange = (event) => {
        const value = event.target.value
        setSearch(value)
        fetchProducts(value)
    }

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Acessórios"
                    description="Busca e listagem dos acessórios automotivos do catálogo."
                />

                <AdminInput
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nome ou marca"
                />

                {loading && <p className="text-sm text-gray text-center">Carregando...</p>}
                {error && <p className="text-sm text-red text-center">{error}</p>}

                {!loading && !error && (
                    <div className="bg-full-white rounded-xl shadow-sm overflow-hidden">
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-light-gray/60 text-deep-blue">
                                    <tr>
                                        <th className="text-left px-4 py-3">Produto</th>
                                        <th className="text-left px-4 py-3">Ref.</th>
                                        <th className="text-left px-4 py-3">Marca</th>
                                        <th className="text-left px-4 py-3">Unidade</th>
                                        <th className="text-center px-4 py-3">Estoque</th>
                                        <th className="text-right px-4 py-3">Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.Idproduto} className="border-t border-gray/10 hover:bg-light-gray transition">
                                            <td className="px-4 py-3 font-medium text-deep-blue">{product.Descricao}</td>
                                            <td className="px-4 py-3 text-gray">{product.Num_fab ?? "-"}</td>
                                            <td className="px-4 py-3 text-gray">{product.Marca}</td>
                                            <td className="px-4 py-3 text-gray">{product.idunidade}</td>
                                            <td className="px-4 py-3 text-center text-gray">{product.estoque}</td>
                                            <td className="px-4 py-3 text-right text-deep-blue font-medium">
                                                R$ {parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid gap-3 p-4 lg:hidden">
                            {products.map((product) => (
                                <article key={product.Idproduto} className="rounded-xl border border-gray/10 bg-light-gray/30 p-4">
                                    <h3 className="font-semibold text-deep-blue">{product.Descricao}</h3>
                                    <p className="text-sm text-gray">{product.Marca}</p>
                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray">Estoque</p>
                                            <p className="font-semibold text-deep-blue">{product.estoque} {product.idunidade}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Preço</p>
                                            <p className="font-semibold text-deep-blue">
                                                R$ {parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <p className="p-6 text-center text-sm text-gray">Nenhum produto encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminProducts
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

Set `localStorage.adminRole = "admin"` in DevTools, then navigate to `http://localhost:5173/admin/products`:

1. Product list loads from `produtos-api` on page mount
2. Type in the search box — results update to match the query

- [ ] **Step 3: Run full test suite**

```bash
npm test -- --run
```

Expected: all tests PASS.

- [ ] **Step 4: Final commit**

```bash
git add src/pages/admin/AdminProducts.jsx
git commit -m "feat: wire AdminProducts to produtos-api search"
```

---

## Auth Swap Checklist (when clientes microservice is ready)

When your co-worker delivers the auth microservice, make these changes:

1. Create `src/services/api/auth.js`:
   ```js
   import { pedidosClient } from './axiosClients.js' // or a new auth client
   export async function login(email, password) {
     const response = await authClient.post('/api/auth/login', { email, password })
     return response.data.data // should return { token }
   }
   ```
2. In `src/pages/Login.jsx`, replace:
   ```js
   setToken(import.meta.env.VITE_DEV_JWT_TOKEN ?? '')
   ```
   with:
   ```js
   const { token } = await authApi.login(formData.email, formData.password)
   setToken(token)
   ```
3. Remove `VITE_DEV_JWT_TOKEN` from `.env.local`
4. Optionally update `ProtectAdminRoute` to decode the JWT role claim
