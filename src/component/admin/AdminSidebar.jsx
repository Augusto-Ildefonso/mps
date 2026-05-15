import { useNavigate } from "react-router-dom"
import { LuLayoutDashboard, LuUsers, LuPackage, LuSettings, LuLogOut } from "react-icons/lu"

const AdminSidebar = ({ activeSection, onSectionChange, onClose, variant = "side" }) => {
    const navigate = useNavigate()

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LuLayoutDashboard, path: "/admin/dashboard" },
        { id: "clients", label: "Clientes", icon: LuUsers, path: "/admin/clients" },
        { id: "products", label: "Produtos", icon: LuPackage, path: "/admin/products" },
        { id: "management", label: "Gerenciar", icon: LuSettings, path: "/admin/management" },
    ]

    const handleLogout = () => {
        localStorage.removeItem("adminRole")
        navigate("/login")
    }

    return (
        <div className={`flex flex-col gap-4 bg-full-white rounded-xl p-4 shadow-sm ${variant === "top" ? "h-auto" : "h-fit"}`}>
            <div className="px-2 py-2 border-b border-gray/20">
                <h3 className="text-sm font-bold text-deep-blue uppercase tracking-wide">Admin Panel</h3>
            </div>

            <nav className={`flex gap-2 ${variant === "top" ? "overflow-x-auto pb-1 lg:flex-wrap" : "flex-col"}`}>
                {menuItems.map((item) => {
                    const IconComponent = item.icon
                    const isActive = activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSectionChange(item.id)
                                if (onClose) {
                                    onClose()
                                }
                                navigate(item.path)
                            }}
                            className={`flex items-center gap-3 rounded-lg font-medium transition ${
                                isActive
                                    ? "bg-orange text-full-white"
                                    : "text-deep-blue hover:bg-light-gray"
                            } ${variant === "top" ? "whitespace-nowrap px-4 py-2" : "px-3 py-3"}`}
                        >
                            <IconComponent size={20} />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-3 font-medium text-red transition hover:bg-red/10"
            >
                <LuLogOut size={20} />
                <span>Sair</span>
            </button>
        </div>
    )
}

export default AdminSidebar
