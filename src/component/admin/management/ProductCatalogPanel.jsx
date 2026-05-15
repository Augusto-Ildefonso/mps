const ProductCatalogPanel = ({ products, totalStockValue, onEdit, onDelete }) => {
    return (
        <div className="rounded-xl bg-full-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray/10 pb-4">
                <h2 className="text-lg font-bold text-deep-blue">Catálogo atual</h2>
                <p className="mt-1 text-sm text-gray">Os itens abaixo alimentam as listas de edição e as opções dos seletores.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                    <article key={product.id} className="rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                        <div className="flex items-start gap-3">
                            <img
                                src={product.images?.[0] || "https://via.placeholder.com/80"}
                                alt={product.name}
                                className="h-16 w-16 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-deep-blue">{product.name}</p>
                                <p className="text-sm text-gray">{product.sku}</p>
                                <p className="text-xs text-gray">{product.brand || product.category}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray">Varejo</p>
                                <p className="font-semibold text-deep-blue">R$ {product.price.toLocaleString("pt-BR")}</p>
                            </div>
                            <div>
                                <p className="text-gray">Estoque</p>
                                <p className="font-semibold text-deep-blue">{product.quantity}</p>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-deep-blue">
                            {(product.compatibleCars || []).slice(0, 3).map((car) => (
                                <span key={car} className="rounded-full bg-full-white px-3 py-1 shadow-sm">
                                    {car}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(product)}
                                className="flex-1 rounded-lg border border-deep-blue px-3 py-2 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(product.id)}
                                className="rounded-lg border border-red px-3 py-2 text-sm font-semibold text-red transition hover:bg-red/10"
                            >
                                Excluir
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Itens no catálogo</p>
                    <p className="text-2xl font-extrabold text-deep-blue">{products.length}</p>
                </div>
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Valor em estoque</p>
                    <p className="text-2xl font-extrabold text-deep-blue">R$ {totalStockValue.toLocaleString("pt-BR")}</p>
                </div>
            </div>
        </div>
    )
}

export default ProductCatalogPanel
