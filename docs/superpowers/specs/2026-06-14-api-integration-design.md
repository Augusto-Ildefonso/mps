# API Integration Design

**Date:** 2026-06-14  
**Project:** MPS — Automotive Accessories E-Commerce SPA  
**Scope:** Wire up React front-end to `produtos-api` (port 3000) and `pedidos-api` (port 3001) using axios and a centralized service layer.

---

## Background

The front-end is a React 19 SPA (Vite, Tailwind CSS, React Router DOM v7). All data is currently mocked — no real HTTP calls are made anywhere. Two backend microservices need to be connected:

| Service | Port | Auth |
|---|---|---|
| `produtos-api` | 3000 | None — all endpoints public |
| `pedidos-api` | 3001 | JWT Bearer required on every request |

A `clientes` auth microservice does not exist yet. JWT tokens must be minted manually until it is delivered by a co-worker. The integration is designed so swapping in the real auth service requires changing one function call in `Login.jsx`.

---

## Approach: Centralized Service Layer

All HTTP logic lives in `src/services/api/`. Components call plain async functions. No component imports axios directly. Auth token management lives in `src/context/AuthContext.jsx`.

---

## New Files

### `src/services/api/axiosClients.js`

Creates and exports two pre-configured axios instances:

- **`produtosClient`**
  - `baseURL`: `import.meta.env.VITE_PRODUTOS_API_URL` (default: `http://localhost:3000`)
  - No auth header
  - Response interceptor: normalises errors into `{ message, status }`

- **`pedidosClient`**
  - `baseURL`: `import.meta.env.VITE_PEDIDOS_API_URL` (default: `http://localhost:3001`)
  - Request interceptor: reads `localStorage.getItem("authToken")` and attaches `Authorization: Bearer <token>` if present
  - Same response error interceptor

The pedidos interceptor reads from `localStorage` directly (not from React context) to avoid circular imports between the axios module and React.

### `src/services/api/products.js`

Plain async functions over `produtosClient`:

| Function | Method | Endpoint |
|---|---|---|
| `searchProducts(q, limit)` | GET | `/api/products/search?q=&limit=` |
| `getProduct(id)` | GET | `/api/products/:id` |
| `createProduct(data)` | POST | `/api/products` |
| `updateProduct(id, data)` | PATCH | `/api/products/:id` |
| `deleteProduct(id)` | DELETE | `/api/products/:id` |
| `uploadProductImage(id, file)` | POST | `/api/products/:id/imagens` (multipart) |
| `listProductImages(id)` | GET | `/api/products/:id/imagens` |
| `deleteProductImage(id, imgId)` | DELETE | `/api/products/:id/imagens/:img_id` |

Product fields follow the legacy CSV naming from the API: `Idproduto`, `Descricao`, `Marca`, `Num_fab`, `idunidade`, `VLR_VENDA1`, `descricao`, `estoque`.

> **Decimal note:** `VLR_VENDA1`, `unit_price`, and `total` serialize as JSON **numbers** (not strings) due to `rust_decimal` with the `serde-float` feature. Use `parseFloat()` for display. For exact financial arithmetic use a decimal library (e.g. `decimal.js`).

Product images are served at `http://localhost:3000/static/{filename}` where `filename` is the UUID from the image record.

### `src/services/api/orders.js`

Plain async functions over `pedidosClient`:

| Function | Method | Endpoint |
|---|---|---|
| `createOrder(payload)` | POST | `/api/pedidos` |
| `listOrders()` | GET | `/api/pedidos` |
| `getOrder(id)` | GET | `/api/pedidos/:id` |
| `updateOrderStatus(id, status)` | PATCH | `/api/pedidos/:id/status` |
| `updateOrderItems(id, items)` | PATCH | `/api/pedidos/:id/items` |
| `deleteOrder(id)` | DELETE | `/api/pedidos/:id` |

Order status state machine: `processando → confirmado | cancelado`, `confirmado → enviado | rejeitado | cancelado`, `enviado → entregue | cancelado`. Terminal states: `entregue`, `cancelado`.

`GET /api/pedidos` returns lightweight order objects (no items/total). Full detail requires a separate `GET /api/pedidos/:id` call.

### `src/context/AuthContext.jsx`

React context providing:

- `token` — JWT string or `null`
- `setToken(t)` — updates state and writes to `localStorage("authToken")`
- `clearToken()` — clears state and removes from localStorage
- `isAuthenticated` — `token !== null`

`AuthProvider` wraps the app in `main.jsx`. On mount it reads any existing token from localStorage to restore session across reloads.

### `.env.local` (git-ignored)

```
VITE_PRODUTOS_API_URL=http://localhost:3000
VITE_PEDIDOS_API_URL=http://localhost:3001
VITE_DEV_JWT_TOKEN=<manually minted JWT>
```

---

## Modified Files

### `App.jsx`
- Route `/product` → `/product/:id`

### `src/main.jsx`
- Wrap app in `<AuthProvider>`

### `src/pages/Login.jsx`
- `onSubmit`: call `setToken(import.meta.env.VITE_DEV_JWT_TOKEN)` from AuthContext, then navigate to `/`
- **Swap point:** When auth microservice is ready, replace with `const { token } = await authApi.login(email, password); setToken(token)`

### `src/pages/SearchPage.jsx`
- `handleKeyDown` on Enter: call `searchProducts(query)`, store results in local state
- Show loading indicator and empty state
- Replace mock product list with real results

### `src/pages/ProductPage.jsx`
- Read product `id` from `useParams()`
- On mount: call `getProduct(id)` and `listProductImages(id)`
- Images rendered from `http://localhost:3000/static/{filename}`
- Replace all mock product data

### `src/component/ProductCard/ProductCard.jsx` and `src/component/ProductSearchCard/ProductSearchCard.jsx`
- Navigation target updated from `/product` to `/product/${product.Idproduto}`

### `src/services/Cart.jsx`
- Persist cart to `localStorage` (key: `cart`) so items survive page reloads
- Public interface unchanged — no other files need updating

### `src/pages/checkout/CheckoutReviewPage.jsx`
- "Finalizar pedido" button: call `createOrder({ items })` mapping cart items into `[{ id_product: Idproduto, quantity }]`
- The pedidos API does not accept an address field — address is displayed in the UI only; it will be sent to the backend once the `clientes` service exists
- On success: clear cart, navigate to `/account/orders`
- On error: show error Alert with the normalised error message; if the error contains an `items` array (stock/not-found failures), display per-item reasons

### `src/pages/account/Orders.jsx` and `src/component/AccountPanels/AccountOrdersPanel.jsx`
- On mount: call `listOrders()`, replace `mockOrders`
- On expand/select order: call `getOrder(id)` for full detail (items + total)

### `src/pages/admin/AdminProducts.jsx`
- Search input calls `searchProducts(q)` — replaces mock product list

### `src/component/admin/management/ProductFormPanel.jsx`
- Create form: call `createProduct(data)`, then `uploadProductImage(id, file)` if a file was selected
- Edit form: call `updateProduct(id, data)`
- Delete: call `deleteProduct(id)`
- `ProductCatalogPanel`: populated from `searchProducts("")` on mount

---

## Error Handling

Both axios instances share a response interceptor that catches non-2xx responses and re-throws a normalised error: `{ message: string, status: number }`. Components display errors using the existing `Alert` component. No global error boundary is added (out of scope).

---

## Auth Swap Checklist (when `clientes` microservice is ready)

1. Create `src/services/api/auth.js` with `login(email, password)` calling the new endpoint
2. In `Login.jsx`, replace `setToken(import.meta.env.VITE_DEV_JWT_TOKEN)` with `const { token } = await authApi.login(email, password); setToken(token)`
3. Optionally update `ProtectAdminRoute` to decode the JWT and check a role claim instead of `localStorage.adminRole`
4. Remove `VITE_DEV_JWT_TOKEN` from `.env.local`

---

### `src/pages/HomePage.jsx`
- No changes — stays on mock data. The produtos API only exposes a search endpoint (`q` required); there is no "list all products" endpoint. The homepage product grid will be wired up once such an endpoint exists or a known query is established.

---

## Out of Scope

- Real authentication microservice integration (deferred to co-worker delivery)
- Admin client management (`AdminClients`) — no corresponding API endpoint exists
- Admin dashboard KPIs / `SalesChart` — no analytics endpoint exists
- Pagination on product search (API supports `limit` param; UI uses default)
- Order item editing after creation (PATCH `/api/pedidos/:id/items` — no UI for this exists)
