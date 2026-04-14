import { LuBell } from "react-icons/lu"

const AccountNotificationsPanel = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-deep-blue mb-4 text-center md:text-left">Notificações</h2>
                <div className="flex flex-col items-center justify-center py-12 text-gray">
                    <LuBell className="text-6xl mb-3 stroke-gray" />
                    <p className="text-base font-medium">Central de Notificações</p>
                    <p className="text-sm mt-1">Gerencie suas preferências de notificação</p>
                    <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
                        <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                            <div>
                                <p className="font-medium text-deep-blue">Notificações por Email</p>
                                <p className="text-xs text-gray">Receba atualizações dos seus pedidos</p>
                            </div>
                            <div className="w-12 h-6 bg-green rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                            <div>
                                <p className="font-medium text-deep-blue">Notificações Push</p>
                                <p className="text-xs text-gray">Alertas em tempo real</p>
                            </div>
                            <div className="w-12 h-6 bg-gray rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                            <div>
                                <p className="font-medium text-deep-blue">Promoções e Ofertas</p>
                                <p className="text-xs text-gray">Fique por diante das novidades</p>
                            </div>
                            <div className="w-12 h-6 bg-green rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountNotificationsPanel
