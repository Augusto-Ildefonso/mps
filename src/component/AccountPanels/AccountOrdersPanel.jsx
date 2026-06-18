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
