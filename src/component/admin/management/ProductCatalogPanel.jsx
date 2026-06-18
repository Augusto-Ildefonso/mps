import { getProductImageUrl } from "../../../services/api/products"

const ProductCatalogPanel = ({ products, totalStockValue, onEdit, onDelete }) => {
    return (
        <div className="rounded-xl bg-full-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray/10 pb-4">
                <h2 className="text-lg font-bold text-deep-blue">Catálogo atual</h2>
                <p className="mt-1 text-sm text-gray">Os itens abaixo alimentam as listas de edição.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                    const productId = product.Idproduto
                    const name = product.Descricao
                    const brand = product.Marca
                    const price = parseFloat(product.VLR_VENDA1)
                    const stock = product.estoque
                    const unit = product.idunidade
                    const firstImage = product._images?.[0]

                    return (
                        <article key={productId} className="rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                            <div className="flex items-start gap-3">
                                {firstImage ? (
                                    <img
                                        src={getProductImageUrl(firstImage.path)}
                                        alt={name}
                                        className="h-16 w-16 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-xl bg-light-gray flex items-center justify-center text-xs text-gray">
                                        Sem img
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-deep-blue">{name}</p>
                                    <p className="text-sm text-gray">{brand}</p>
                                    <p className="text-xs text-gray">{unit}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray">Preço</p>
                                    <p className="font-semibold text-deep-blue">
                                        R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray">Estoque</p>
                                    <p className="font-semibold text-deep-blue">{stock}</p>
                                </div>
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
                                    onClick={() => onDelete(productId)}
                                    className="rounded-lg border border-red px-3 py-2 text-sm font-semibold text-red transition hover:bg-red/10"
                                >
                                    Excluir
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Itens no catálogo</p>
                    <p className="text-2xl font-extrabold text-deep-blue">{products.length}</p>
                </div>
                <div className="rounded-xl bg-light-gray/20 p-4">
                    <p className="text-sm text-gray">Valor em estoque</p>
                    <p className="text-2xl font-extrabold text-deep-blue">
                        R$ {totalStockValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductCatalogPanel
