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
