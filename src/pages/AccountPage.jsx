import { useState } from "react"
import Header from "../component/Header/Header"
import Navbar from "../component/NavBar/NavBar"
import BannerNav from "../component/NavBar/BannerNav"
import AccountSidebar from "../component/AccountSidebar/AccountSidebar"
import { useNavigate } from "react-router-dom"
import {
    AccountOverviewPanel,
    AccountOrdersPanel,
    AccountAddressesPanel,
    AccountPaymentsPanel,
    AccountSettingsPanel,
    AccountNotificationsPanel,
    AccountHelpPanel
} from "../component/AccountPanels"

const mockUser = {
    name: "Marco Silva",
    email: "marco.silva@email.com",
    avatar: null
}

const AccountPage = () => {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState("visao-geral")

    const handleLogout = () => {
        navigate("/login")
    }

    const renderPanel = () => {
        switch (activeSection) {
            case "visao-geral":
                return <AccountOverviewPanel userName={mockUser.name} userEmail={mockUser.email} userAvatar={mockUser.avatar} />
            case "pedidos":
                return <AccountOrdersPanel />
            case "enderecos":
                return <AccountAddressesPanel />
            case "pagamentos":
                return <AccountPaymentsPanel />
            case "configuracoes":
                return <AccountSettingsPanel />
            case "notificacoes":
                return <AccountNotificationsPanel />
            case "ajuda":
                return <AccountHelpPanel />
            default:
                return <AccountOverviewPanel userName={mockUser.name} userEmail={mockUser.email} userAvatar={mockUser.avatar} />
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <BannerNav />
            
            <div className="flex-1 px-2 md:px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 mt-4 max-w-7xl mx-auto">
                    {/* Barra lateral */}
                    <div className="order-2 md:order-1">
                        {/* Perfil - Visivel apenas no Mobile */}
                        <div className="md:hidden flex flex-row items-center gap-4 bg-full-white rounded-xl p-4 mb-4">
                            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-dark-blue text-full-white text-3xl font-bold">
                                {mockUser.avatar ? (
                                    <img src={mockUser.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{mockUser.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h1 className="font-extrabold text-xl text-deep-blue">{mockUser.name}</h1>
                                <p className="text-sm text-gray">{mockUser.email}</p>
                            </div>
                        </div>

                        {/* Perfil - Visivel apenas no Desktop */}
                        <div className="hidden md:flex flex-col items-center gap-3 bg-full-white rounded-xl p-6 mb-4">
                            <div className="flex justify-center items-center w-20 h-20 rounded-full bg-dark-blue text-full-white text-4xl font-bold">
                                {mockUser.avatar ? (
                                    <img src={mockUser.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{mockUser.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="flex flex-col items-center">
                                <h1 className="font-extrabold text-lg text-deep-blue">{mockUser.name}</h1>
                                <p className="text-sm text-gray">{mockUser.email}</p>
                            </div>
                        </div>

                        {/* Barra de navegação */}
                        <AccountSidebar 
                            activeSection={activeSection} 
                            onSectionChange={setActiveSection}
                            onLogout={handleLogout}
                        />
                    </div>

                    {/* Paineis */}
                    <div className="order-1 md:order-2">
                        <div className="hidden md:block">
                            {renderPanel()}
                        </div>
                    </div>
                </div>
            </div>
            
            <Navbar />
        </div>
    )
}

export default AccountPage
