import {  LuPackage, LuMapPin, LuCreditCard, LuSettings, LuHeart, LuMessageSquare, LuBell, LuCircleHelp, LuLogOut } from "react-icons/lu"
import Header from "../component/Header/Header"
import Navbar from "../component/NavBar/NavBar"
import AccountMenuItem from "../component/AccountMenuItem/AccountMenuItem"
import { useNavigate } from "react-router-dom"
import BannerNav from "../component/NavBar/BannerNav"

const mockUser = {
    name: "Marco Silva",
    email: "marco.silva@email.com",
    avatar: null
}

const AccountPage = () => {
    const navigate = useNavigate();
    const handleNavigation = (section) => {
        const routes = {
            "pedidos": "/account/orders",
            "endereços": "/account/addresses",
            "pagamentos": "/account/payments",
            "configurações": "/account/settings",
            "notificações": "/account/notifications",
            "ajuda": "/account/help",
            "logout": "/logout"
        };
        navigate(routes[section] || "/account");
    }

    return (
        <div className="grid grid-rows min-h-screen w-auto p-2 gap-4 pb-20">
            <Header />
            <BannerNav />
            <section className="flex flex-col gap-4 px-4">
                {/* Seção do perfil */}
                <div className="flex flex-row items-center gap-4 bg-full-white rounded-xl p-4">
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

                {/* Pedidos feitos*/}
                <div className="flex flex-col gap-3">
                    <h2 className="font-bold text-lg text-deep-blue">Pedidos</h2>
                    <AccountMenuItem 
                        icon={LuPackage} 
                        label="Meus Pedidos" 
                        description="Acompanhe seus pedidos"
                        onClick={() => handleNavigation("pedidos")}
                    />
                </div>

                {/* Endereços */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-bold text-lg text-deep-blue">Conta</h2>
                    <AccountMenuItem 
                        icon={LuMapPin} 
                        label="Endereços" 
                        description="Gerencie seus endereços"
                        onClick={() => handleNavigation("endereços")}
                    />
                    {/* Pagamentos */}
                    <AccountMenuItem 
                        icon={LuCreditCard} 
                        label="Pagamentos" 
                        description="Formas de pagamento"
                        onClick={() => handleNavigation("pagamentos")}
                    />
                </div>

                {/* Configurações */}
                <div className="flex flex-col gap-3">
                    <h2 className="font-bold text-lg text-deep-blue">Configurações e Suporte</h2>
                    <AccountMenuItem 
                        icon={LuSettings} 
                        label="Configurações" 
                        onClick={() => handleNavigation("configurações")}
                    />
                    {/* Notificações */}
                    <AccountMenuItem 
                        icon={LuBell} 
                        label="Notificações" 
                        onClick={() => handleNavigation("notificações")}
                    />
                    {/* Ajuda */}
                    <AccountMenuItem 
                        icon={LuCircleHelp} 
                        label="Ajuda" 
                        onClick={() => handleNavigation("ajuda")}
                    />
                </div>

                {/* Sair. Mas por que? :< */}
                <button
                    type="button"
                    onClick={() => handleNavigation("logout")}
                    className="w-full flex flex-row items-center justify-center gap-2 p-4 bg-red text-full-white rounded-xl font-bold active:scale-[0.98] transition duration-300 mt-4"
                >
                    <LuLogOut className="text-2xl" />
                    <span>Sair da Conta</span>
                </button>
            </section>
            <Navbar />
        </div>
    )
}

export default AccountPage
