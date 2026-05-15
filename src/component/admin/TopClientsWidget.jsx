const TopClientsWidget = ({ clients }) => {
    return (
        <div className="bg-full-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-deep-blue mb-4">Top Clientes por Receita</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-gray/20">
                        <tr>
                            <th className="text-left py-3 px-2 font-semibold text-deep-blue">Cliente</th>
                            <th className="text-center py-3 px-2 font-semibold text-deep-blue">Pedidos</th>
                            <th className="text-right py-3 px-2 font-semibold text-deep-blue">Total Gasto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} className="border-b border-gray/10 hover:bg-light-gray transition">
                                <td className="py-3 px-2 text-deep-blue">{client.name}</td>
                                <td className="text-center py-3 px-2 text-gray">{client.orders}</td>
                                <td className="text-right py-3 px-2 font-medium text-deep-blue">
                                    R$ {client.totalSpent.toLocaleString("pt-BR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopClientsWidget
