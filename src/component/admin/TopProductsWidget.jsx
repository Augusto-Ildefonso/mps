const TopProductsWidget = ({ products }) => {
    return (
        <div className="bg-full-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-deep-blue mb-4">Top Produtos Mais Vendidos</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-gray/20">
                        <tr>
                            <th className="text-left py-3 px-2 font-semibold text-deep-blue">Produto</th>
                            <th className="text-center py-3 px-2 font-semibold text-deep-blue">Unidades</th>
                            <th className="text-right py-3 px-2 font-semibold text-deep-blue">Receita</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray/10 hover:bg-light-gray transition">
                                <td className="py-3 px-2 text-deep-blue">{product.name}</td>
                                <td className="text-center py-3 px-2 text-gray">{product.unitsSold}</td>
                                <td className="text-right py-3 px-2 font-medium text-deep-blue">
                                    R$ {product.revenue.toLocaleString("pt-BR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopProductsWidget
