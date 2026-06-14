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
  const [detailError, setDetailError] = useState(false)

  const handleToggle = async () => {
    const next = !expanded
    setExpanded(next)
    if (!next) setDetailError(false)
    if (next && !detail) {
      setLoadingDetail(true)
      try {
        const completeOrder = await getOrder(order.id)
        setDetail(completeOrder)
      } catch {
        setDetailError(true)
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
        {!loadingDetail && detailError && (
          <p className="py-4 text-sm text-red text-center">Erro ao carregar itens. Tente novamente.</p>
        )}
        {!loadingDetail && detail && (
          <>
            {detail.items.map((item) => (
              <div key={item.id} className="flex flex-row items-center justify-between gap-3 py-3 border-b border-gray/10 last:border-0">
                <div className="flex flex-col">
                  <p className="font-bold text-deep-blue">Produto #{item.id_product}</p>
                  <p className="text-sm text-gray">Qtd: {item.quantity}</p>
                </div>
                <p className="font-bold">{formatCurrency(parseFloat(item.unit_price) * item.quantity)}</p>
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
