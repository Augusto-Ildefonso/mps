import { LuBanknote, LuChartColumn, LuPackage, LuUsers } from "react-icons/lu"

const DashboardOverview = ({ stats }) => {
    const StatCard = ({ label, value, change, icon }) => (
        <div className="bg-full-white rounded-xl p-5 shadow-sm border border-gray/10">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray mb-1">{label}</p>
                    <p className="text-2xl font-extrabold text-deep-blue">{value}</p>
                    <p className={`text-xs mt-2 font-medium ${change >= 0 ? "text-green" : "text-red"}`}>
                        {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs. mês anterior
                    </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-light-gray text-deep-blue/70">
                    {icon}
                </div>
            </div>
        </div>
    )

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Total de Vendas"
                value={`R$ ${stats.totalSales.toLocaleString("pt-BR")}`}
                change={stats.totalSalesChange}
                icon={<LuBanknote size={22} />}
            />
            <StatCard
                label="Total de Clientes"
                value={stats.totalClients}
                change={stats.totalClientsChange}
                icon={<LuUsers size={22} />}
            />
            <StatCard
                label="Total de Produtos"
                value={stats.totalProducts}
                change={stats.totalProductsChange}
                icon={<LuPackage size={22} />}
            />
            <StatCard
                label="Ticket Médio"
                value={`R$ ${stats.avgOrderValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                change={stats.avgOrderValueChange}
                icon={<LuChartColumn size={22} />}
            />
        </div>
    )
}

export default DashboardOverview
