import { LuCirclePlus, LuCircleMinus } from "react-icons/lu";
import React from "react";
const OrderBlock = ({ OrderInfo }) => {
    const statusColors = {
        "Entregue": "bg-green",
        "Em andamento": "bg-yellow",
        "Cancelado": "bg-red",
        "Aguardando pagamento": "bg-light-blue"
    }
    const [expanded, setExpanded] = React.useState(true);
    return (
        <div className="rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-4 bg-full-white">
            {/* Header do pedido, que inclue o status, data e número do pedido */}
            <div>
                <span className={`${statusColors[OrderInfo.status]} text-full-white text-xs font-bold px-3 py-1 rounded`}>
                    {OrderInfo.status}
                </span>
            </div>
            <div className="flex gap-2 mt-2 divide-x border-b pb-2">
                <p className="text-sm font-light text-gray flex-initial text-left w-15">Data: {OrderInfo.orderDate}</p>
                <p className="text-sm font-light text-gray flex-initial text-right w-32">Pedido:  {OrderInfo.orderId}</p>
                <button className="border-none ml-auto" type="button" title={expanded ? "Ver menos" : "Ver mais"} aria-label={expanded ? "Ver menos" : "Ver mais"} onClick={() => setExpanded(!expanded)} >
                    <div className={`transition-transform duration-600 ${expanded ? 'rotate-180' : 'rotate-90'}`}>
                        {expanded ? <LuCircleMinus className="text-2xl text-gray cursor-pointer ml-auto"/> : <LuCirclePlus className="text-2xl text-gray cursor-pointer ml-auto" />}
                    </div>
                </button>
            </div>
            {/* Lista de produtos do pedido, que vamos pegar da base de dados */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {OrderInfo.product.map((product) => (
                        <div key={product.id} className="flex flex-row items-center gap-3 pb-5">
                            <img src={product.image} alt={product.name} className="w-16 h16 object-cover" />
                            <div className="flex flex-col">
                                <p className="font-bold text-deep-blue">{product.name}</p>
                            </div>
                            <p className="ml-auto font-bold">R${product.price}</p>
                        </div>
                    ))}
                </div>
            {/* Valor total do pedido, que vamos pegar da base de dados */}
            <div className="pt-2">
                <p className="font-bold text-right ml-auto">Total: R${OrderInfo.totalAmount}</p>
            </div>
        </div>
    )
}
export default OrderBlock