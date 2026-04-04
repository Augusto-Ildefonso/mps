
const OrderBlock = ({ OrderInfo }) => {
    const statusColors = {
        "Entregue": "green",
        "Em andamento": "yellow",
        "Cancelado": "red",
        "Aguardando pagamento": "blue"
    }
    return (
        <div className="rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-4 bg-full-white">
            <div>
                <span className={`bg-${statusColors[OrderInfo.status]} text-full-white text-xs font-bold px-3 py-1 rounded`}>
                    {OrderInfo.status}
                </span>    
            </div>
            <div className="flex gap-2 mt-2 divide-x border-b pb-2">
                <p className="text-sm font-light text-gray flex-initial text-left w-15">Data: {OrderInfo.orderDate}</p>
                <p className="text-sm font-light text-gray flex-initial text-right w-32">Pedido:  {OrderInfo.orderId}</p>
            </div>
            <div className="border-b pb-2">
                {OrderInfo.product.map((product) => (
                    <div key={product.id} className="flex flex-row items-center gap-3 pb-5">
                        <img src={product.image} alt={product.name} className="w-16 h16 object-cover"/>
                        <div className="flex flex-col">
                            <p className="font-bold text-deep-blue">{product.name}</p>
                        </div>
                        <p className="ml-auto font-bold">R${product.price}</p>
                    </div>
                ))}
            </div>
            <div className="pt-2">
                <p className="font-bold text-right ml-auto">Total: R${OrderInfo.totalAmount}</p>
            </div>
        </div>
    )
}
export default OrderBlock