import { pedidosClient } from './axiosClients.js'

/**
 * Fetch admin dashboard overview stats.
 * @returns {Promise<{ totalSales: number, totalSalesChange: number, totalClients: number, totalClientsChange: number, totalProducts: number, totalProductsChange: number, avgOrderValue: number, avgOrderValueChange: number }>}
 */
export async function getDashboardStats() {
  const response = await pedidosClient.get('/api/admin/dashboard/stats')
  return response.data.data.stats
}

/**
 * Fetch daily sales data for the chart.
 * @param {number} [days=30] - Number of days to include (max 365).
 * @returns {Promise<Array<{ date: string, sales: number }>>}
 */
export async function getSalesData(days = 30) {
  const response = await pedidosClient.get('/api/admin/dashboard/sales', {
    params: { days },
  })
  return response.data.data.sales
}

/**
 * Fetch top-selling products.
 * @param {number} [limit=5] - Max products to return (max 50).
 * @returns {Promise<Array<{ id: number, name: string, unitsSold: number, revenue: number }>>}
 */
export async function getTopProducts(limit = 5) {
  const response = await pedidosClient.get('/api/admin/dashboard/top-products', {
    params: { limit },
  })
  return response.data.data.products
}
