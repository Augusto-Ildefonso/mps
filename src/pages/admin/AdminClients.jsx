import { useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"

const AdminClients = () => {
    const [activeSection, setActiveSection] = useState("clients")

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Clientes"
                    description="Lista, busca e histórico resumido dos clientes cadastrados."
                />

                <div className="bg-full-white rounded-xl p-8 shadow-sm text-center text-gray">
                    <p className="text-lg font-medium">Nenhum cliente encontrado.</p>
                    <p className="mt-2 text-sm">A listagem de clientes estará disponível em breve.</p>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminClients
