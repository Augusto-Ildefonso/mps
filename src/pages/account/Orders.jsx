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
