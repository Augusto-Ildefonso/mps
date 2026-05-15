import { useMemo, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminInput from "../../component/admin/forms/AdminInput"
import AdminSelect from "../../component/admin/forms/AdminSelect"
import { mockClients, mockClientPurchaseHistory } from "../../mock/adminMock"

const AdminClients = () => {
    const [activeSection, setActiveSection] = useState("clients")
    const [search, setSearch] = useState("")
    const [documentFilter, setDocumentFilter] = useState("all")

    const filteredClients = useMemo(() => {
        const searchTerm = search.trim().toLowerCase()

        return mockClients.filter((client) => {
            const matchesSearch =
                searchTerm.length === 0 ||
                client.name.toLowerCase().includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm)

            const matchesDocument =
                documentFilter === "all" || client.documentType.toLowerCase() === documentFilter

            return matchesSearch && matchesDocument
        })
    }, [search, documentFilter])

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Clientes"
                    description="Lista, busca e histórico resumido dos clientes cadastrados."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminInput
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por nome ou e-mail"
                    />

                    <AdminSelect
                        value={documentFilter}
                        onChange={(event) => setDocumentFilter(event.target.value)}
                    >
                        <option value="all">Todos os documentos</option>
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                    </AdminSelect>
                </div>

                <div className="bg-full-white rounded-xl shadow-sm overflow-hidden">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-light-gray/60 text-deep-blue">
                                <tr>
                                    <th className="text-left px-4 py-3">Cliente</th>
                                    <th className="text-left px-4 py-3">E-mail</th>
                                    <th className="text-center px-4 py-3">Doc.</th>
                                    <th className="text-center px-4 py-3">Pedidos</th>
                                    <th className="text-right px-4 py-3">Total gasto</th>
                                    <th className="text-right px-4 py-3">Último pedido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="border-t border-gray/10 hover:bg-light-gray transition">
                                        <td className="px-4 py-3 font-medium text-deep-blue">{client.name}</td>
                                        <td className="px-4 py-3 text-gray">{client.email}</td>
                                        <td className="px-4 py-3 text-center text-gray">{client.documentType}</td>
                                        <td className="px-4 py-3 text-center text-gray">{client.orders}</td>
                                        <td className="px-4 py-3 text-right text-deep-blue font-medium">
                                            R$ {client.totalPurchases.toLocaleString("pt-BR")}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray">{client.lastOrder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-3 p-4 lg:hidden">
                        {filteredClients.map((client) => {
                            const history = mockClientPurchaseHistory[client.id] || []

                            return (
                                <article key={client.id} className="rounded-xl border border-gray/10 bg-light-gray/30 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-deep-blue">{client.name}</h3>
                                            <p className="text-sm text-gray">{client.email}</p>
                                        </div>
                                        <span className="rounded-full bg-full-white px-3 py-1 text-xs font-semibold text-deep-blue">
                                            {client.documentType}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray">Pedidos</p>
                                            <p className="font-semibold text-deep-blue">{client.orders}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Total gasto</p>
                                            <p className="font-semibold text-deep-blue">R$ {client.totalPurchases.toLocaleString("pt-BR")}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Último pedido</p>
                                            <p className="font-semibold text-deep-blue">{client.lastOrder}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Histórico</p>
                                            <p className="font-semibold text-deep-blue">{history.length} compras</p>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-full-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-deep-blue mb-4">Resumo</h2>
                        <div className="space-y-3 text-sm text-gray">
                            <p>Total de clientes carregados: {mockClients.length}</p>
                            <p>Clientes filtrados: {filteredClients.length}</p>
                        </div>
                    </div>

                    <div className="bg-full-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-deep-blue mb-4">Histórico recente</h2>
                        <div className="space-y-3 text-sm text-gray">
                            {filteredClients.slice(0, 3).map((client) => {
                                const history = mockClientPurchaseHistory[client.id] || []

                                return (
                                    <div key={client.id} className="rounded-lg border border-gray/10 p-3">
                                        <p className="font-medium text-deep-blue">{client.name}</p>
                                        <p>{history.length} compras registradas no mock.</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminClients
