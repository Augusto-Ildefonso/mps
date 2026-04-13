import { LuPackage, LuMapPin, LuCreditCard, LuSettings, LuBell, LuCircleHelp, LuLogOut, LuLayoutDashboard } from "react-icons/lu"
import AccountMenuItem from "../AccountMenuItem/AccountMenuItem"
import { useNavigate } from "react-router-dom"
const AccountSidebar = ({ activeSection, onSectionChange, onLogout }) => {
    const navigate = useNavigate()
    const handleNavigation = (goTo) => {
        
        navigate(goTo || "/account") 
    }
    const menuItems = [
        { id: "visao-geral", label: "Visão Geral", icon: LuLayoutDashboard, description: "Resumo da sua conta", desktopOnly: true, navigateTo: "/account" },
        { id: "pedidos", label: "Meus Pedidos", icon: LuPackage, description: "Acompanhe seus pedidos", desktopOnly: false, navigateTo: "/account/orders" },
        { id: "enderecos", label: "Endereços", icon: LuMapPin, description: "Gerencie seus endereços", desktopOnly: false, navigateTo: "/account/addresses" },
        { id: "pagamentos", label: "Pagamentos", icon: LuCreditCard, description: "Formas de pagamento", desktopOnly: false, navigateTo: "/account/payments" },
        { id: "configuracoes", label: "Configurações", icon: LuSettings, description: "Configurações da conta", desktopOnly: false, navigateTo: "/account/settings" },
        { id: "notificacoes", label: "Notificações", icon: LuBell, description: "Preferências de notificação", desktopOnly: false, navigateTo: "/account/notifications" },
        { id: "ajuda", label: "Ajuda", icon: LuCircleHelp, description: "Suporte e dúvidas", desktopOnly: false, navigateTo: "/account/help" },
    ]

    return (
        <>
            {/* Navegação pelo sidebar *Desktop* */}
            <div className="hidden md:flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSectionChange(item.id)}
                            className={`w-full flex flex-row items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                                isActive
                                    ? "bg-deep-blue text-full-white shadow-lg"
                                    : "bg-full-white text-deep-blue hover:bg-light-gray"
                            }`}
                        >
                            <Icon className={`text-2xl shrink-0 ${isActive ? "stroke-full-white" : "stroke-deep-blue"}`} />
                            <div className="flex flex-col items-start flex-1">
                                <p className={`font-bold text-sm ${isActive ? "text-full-white" : "text-deep-blue"}`}>{item.label}</p>
                                {item.description && (
                                    <p className={`text-xs ${isActive ? "text-gray-300" : "text-gray"}`}>{item.description}</p>
                                )}
                            </div>
                        </button>
                    )
                })}

                {/* Logout */}
                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex flex-row items-center gap-3 p-4 bg-red text-full-white rounded-xl font-bold active:scale-[0.98] transition duration-300 mt-2 hover:bg-red/90"
                >
                    <LuLogOut className="text-2xl shrink-0" />
                    <div className="flex flex-col items-start flex-1">
                        <p className="font-bold text-sm">Sair da Conta</p>
                    </div>
                </button>
            </div>

            {/* Navegação em Mobile */}
            <div className="md:hidden flex flex-col gap-3">
                {menuItems.map((item) => {
                    if (item.desktopOnly) return null

                    const Icon = item.icon
                    return (
                        <AccountMenuItem
                            key={item.id}
                            icon={Icon}
                            label={item.label}
                            description={item.description}
                            isActive={activeSection === item.id}
                            onClick={() => handleNavigation(item.navigateTo)}
                        />
                    )
                })}

                {/* Logout */}
                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex flex-row items-center justify-center gap-2 p-4 bg-red text-full-white rounded-xl font-bold active:scale-[0.98] transition duration-300 mt-2"
                >
                    <LuLogOut className="text-2xl" />
                    <span>Sair da Conta</span>
                </button>
            </div>
        </>
    )
}

export default AccountSidebar
