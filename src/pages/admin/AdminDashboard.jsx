import { useEffect, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import DashboardOverview from "../../component/admin/DashboardOverview"
import SalesChart from "../../component/admin/SalesChart"
import TopProductsWidget from "../../component/admin/TopProductsWidget"
import TopClientsWidget from "../../component/admin/TopClientsWidget"
import {
    getDashboardStats,
    getSalesData,
    getTopProducts,
} from "../../services/api/admin"
const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("dashboard")
    const [stats, setStats] = useState(null)
    const [salesData, setSalesData] = useState(null)
    const [topProducts, setTopProducts] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const [s, sd, tp] = await Promise.all([
                    getDashboardStats(),
                    getSalesData(30),
                    getTopProducts(5),
                ])
                if (cancelled) return
                setStats(s)
                setSalesData(sd)
                setTopProducts(tp)
            } catch {
                // Fallback remains empty — UI shows nothing
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Dashboard"
                    description="Visão geral de vendas, clientes e produtos."
                />

                {loading ? (
                    <p className="text-sm text-gray">Carregando dados do dashboard...</p>
                ) : (
                    <>
                        <DashboardOverview stats={stats} />
                        <SalesChart data={salesData} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TopProductsWidget products={topProducts} />
                            <TopClientsWidget clients={[]} />
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard
