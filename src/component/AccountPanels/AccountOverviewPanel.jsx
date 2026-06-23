import { useEffect, useState } from "react"
import { LuPackage, LuMapPin, LuCreditCard } from "react-icons/lu"
import { listOrders } from "../../services/api/orders"
import { listAddresses } from "../../services/api/users"

const AccountOverviewPanel = ({ userName, userEmail, userAvatar }) => {
    const [ordersCount, setOrdersCount] = useState(null)
    const [addressesCount, setAddressesCount] = useState(null)

    useEffect(() => {
        listOrders()
            .then((data) => setOrdersCount(data?.orders?.length ?? data?.length ?? 0))
            .catch(() => setOrdersCount(0))
        listAddresses()
            .then((data) => setAddressesCount(data?.length ?? 0))
            .catch(() => setAddressesCount(0))
    }, [])

    const stats = [
        { icon: LuPackage, label: "Pedidos Recentes", value: ordersCount ?? "...", color: "bg-blue" },
        { icon: LuMapPin, label: "Endereços Salvos", value: addressesCount ?? "...", color: "bg-green" },
        { icon: LuCreditCard, label: "Formas de Pagamento", value: "0", color: "bg-orange" },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-deep-blue to-dark-blue rounded-xl p-6 text-white">
                <p className="text-gray-300 text-sm">Gerencie sua conta, acompanhe seus pedidos e muito mais.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="bg-full-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-2xl stroke-white text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold text-deep-blue">{stat.value}</p>
                                    <p className="text-xs text-gray">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-full-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-deep-blue mb-3">Atividade Recente</h3>
                <div className="flex flex-col items-center justify-center py-8 text-gray">
                    <LuPackage className="text-5xl mb-3 stroke-gray" />
                    <p className="text-sm">Nenhuma atividade recente para exibir</p>
                </div>
            </div>
        </div>
    )
}

export default AccountOverviewPanel
