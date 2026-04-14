import OrderBlock from "../../component/Orders/OrderBlock"
import { mockOrders } from "../../mock"

const AccountOrdersPanel = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-deep-blue mb-4">Meus Pedidos</h2>
                <div className="flex flex-col gap-3">
                    {mockOrders.map((order) => (
                        <OrderBlock key={order.orderId} OrderInfo={order} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AccountOrdersPanel
