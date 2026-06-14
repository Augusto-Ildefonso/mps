import { useEffect, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminInput from "../../component/admin/forms/AdminInput"
import { searchProducts } from "../../services/api/products"

const AdminProducts = () => {
    const [activeSection, setActiveSection] = useState("products")
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProducts = async (query) => {
        setLoading(true)
        setError(null)
        try {
            const data = await searchProducts(query)
            setProducts(data)
        } catch (err) {
            setError(err.message ?? "Erro ao carregar produtos.")
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchProducts("")
    }, [])

    const handleSearchChange = (event) => {
        const value = event.target.value
        setSearch(value)
        fetchProducts(value)
    }

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Acessórios"
                    description="Busca e listagem dos acessórios automotivos do catálogo."
                />

                <AdminInput
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Buscar por nome ou marca"
                />

                {loading && <p className="text-sm text-gray text-center">Carregando...</p>}
                {error && <p className="text-sm text-red text-center">{error}</p>}

                {!loading && !error && (
                    <div className="bg-full-white rounded-xl shadow-sm overflow-hidden">
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-light-gray/60 text-deep-blue">
                                    <tr>
                                        <th className="text-left px-4 py-3">Produto</th>
                                        <th className="text-left px-4 py-3">Ref.</th>
                                        <th className="text-left px-4 py-3">Marca</th>
                                        <th className="text-left px-4 py-3">Unidade</th>
                                        <th className="text-center px-4 py-3">Estoque</th>
                                        <th className="text-right px-4 py-3">Preço</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.Idproduto} className="border-t border-gray/10 hover:bg-light-gray transition">
                                            <td className="px-4 py-3 font-medium text-deep-blue">{product.Descricao}</td>
                                            <td className="px-4 py-3 text-gray">{product.Num_fab ?? "-"}</td>
                                            <td className="px-4 py-3 text-gray">{product.Marca}</td>
                                            <td className="px-4 py-3 text-gray">{product.idunidade}</td>
                                            <td className="px-4 py-3 text-center text-gray">{product.estoque}</td>
                                            <td className="px-4 py-3 text-right text-deep-blue font-medium">
                                                R$ {parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid gap-3 p-4 lg:hidden">
                            {products.map((product) => (
                                <article key={product.Idproduto} className="rounded-xl border border-gray/10 bg-light-gray/30 p-4">
                                    <h3 className="font-semibold text-deep-blue">{product.Descricao}</h3>
                                    <p className="text-sm text-gray">{product.Marca}</p>
                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray">Estoque</p>
                                            <p className="font-semibold text-deep-blue">{product.estoque} {product.idunidade}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Preço</p>
                                            <p className="font-semibold text-deep-blue">
                                                R$ {parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <p className="p-6 text-center text-sm text-gray">Nenhum produto encontrado.</p>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminProducts
