import { useMemo, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminInput from "../../component/admin/forms/AdminInput"
import AdminSelect from "../../component/admin/forms/AdminSelect"
import { mockProducts } from "../../mock/adminMock"

const AdminProducts = () => {
    const [activeSection, setActiveSection] = useState("products")
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const categories = useMemo(() => {
        return Array.from(new Set(mockProducts.map((product) => product.category)))
    }, [])

    const filteredProducts = useMemo(() => {
        const searchTerm = search.trim().toLowerCase()

        return mockProducts.filter((product) => {
            const matchesSearch =
                searchTerm.length === 0 ||
                product.name.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm)

            const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

            return matchesSearch && matchesCategory
        })
    }, [search, categoryFilter])

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Acessórios"
                    description="Busca, categoria, marca e estoque dos acessórios automotivos em mock."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nome ou SKU"
                    />

                    <AdminSelect
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                        <option value="all">Todas as categorias</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </AdminSelect>
                </div>

                <div className="bg-full-white rounded-xl shadow-sm overflow-hidden">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-light-gray/60 text-deep-blue">
                                <tr>
                                    <th className="text-left px-4 py-3">Produto</th>
                                    <th className="text-left px-4 py-3">SKU</th>
                                    <th className="text-left px-4 py-3">Categoria</th>
                                    <th className="text-left px-4 py-3">Marca</th>
                                    <th className="text-center px-4 py-3">Qtd.</th>
                                    <th className="text-right px-4 py-3">Preço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-t border-gray/10 hover:bg-light-gray transition">
                                        <td className="px-4 py-3 font-medium text-deep-blue">{product.name}</td>
                                        <td className="px-4 py-3 text-gray">{product.sku}</td>
                                        <td className="px-4 py-3 text-gray">{product.category}</td>
                                        <td className="px-4 py-3 text-gray">{product.brand || "-"}</td>
                                        <td className="px-4 py-3 text-center text-gray">{product.quantity}</td>
                                        <td className="px-4 py-3 text-right text-deep-blue font-medium">
                                            R$ {product.price.toLocaleString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-3 p-4 lg:hidden">
                        {filteredProducts.map((product) => (
                            <article key={product.id} className="rounded-xl border border-gray/10 bg-light-gray/30 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={product.images?.[0] || "https://via.placeholder.com/80"}
                                            alt={product.name}
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-deep-blue">{product.name}</h3>
                                            <p className="text-sm text-gray">{product.sku}</p>
                                            <p className="text-xs text-gray">{product.manufacturer || "Empresa não informada"}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-full-white px-3 py-1 text-xs font-semibold text-deep-blue">
                                        {product.brand || product.category}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray">Qtd.</p>
                                        <p className="font-semibold text-deep-blue">{product.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray">Preço</p>
                                        <p className="font-semibold text-deep-blue">R$ {product.price.toLocaleString("pt-BR")}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray">Fitment</p>
                                        <p className="font-semibold text-deep-blue">{(product.compatibleCars || []).length} carros</p>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-deep-blue">
                                    {(product.compatibleCars || []).slice(0, 3).map((car) => (
                                        <span key={car} className="rounded-full bg-full-white px-3 py-1 shadow-sm">
                                            {car}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminProducts
