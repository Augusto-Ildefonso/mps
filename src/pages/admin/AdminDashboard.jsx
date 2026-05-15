import { useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import DashboardOverview from "../../component/admin/DashboardOverview"
import SalesChart from "../../component/admin/SalesChart"
import TopProductsWidget from "../../component/admin/TopProductsWidget"
import TopClientsWidget from "../../component/admin/TopClientsWidget"
import {
    mockDashboardStats,
    mockSalesData,
    mockTopProducts,
    mockTopClients,
} from "../../mock/adminMock"

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("dashboard")

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Dashboard"
                    description="Visão geral de vendas, clientes e produtos."
                />

                <DashboardOverview stats={mockDashboardStats} />

                <SalesChart data={mockSalesData} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopProductsWidget products={mockTopProducts} />
                    <TopClientsWidget clients={mockTopClients} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard
