import { useNavigate, useLocation } from "react-router-dom"
import { LuHouse, LuSearch, LuShoppingCart, LuUser } from "react-icons/lu"
const BannerNav = () => {
    const navigate = useNavigate()
        const location = useLocation()
        
        const navItems = [
            { path: "/", label: "Início", icon: LuHouse },
            { path: "/search", label: "Buscar", icon: LuSearch },
            { path: "/shoppingcart", label: "Carrinho", icon: LuShoppingCart },
            { path: "/account", label: "Conta", icon: LuUser },
        ]
    return (
        <nav className="hidden md:flex flex-row justify-center items-center gap-6 mt-3 py-2 bg-light-gray rounded-lg px-4">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                    <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-row items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white ${
                                isActive 
                                    ? "bg-white stroke-deep-blue text-deep-blue font-bold shadow-sm" 
                                    : "stroke-gray text-gray hover:stroke-deep-blue hover:text-deep-blue"
                            }`}
                        >
                            <Icon className="text-xl" />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    )
                })}
            </nav>
    )
}

export default BannerNav