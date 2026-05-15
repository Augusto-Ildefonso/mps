import { useState } from "react"
import { LuBell } from "react-icons/lu"

const AccountNotificationsPanel = () => {
    const [toggleEmail, setToggleEmail] = useState(true)
    const [togglePush, setTogglePush] = useState(false)
    const [togglePromotions, setTogglePromotions] = useState(true)

    const renderToggle = (enabled, setEnabled, label) => (
        <button
            type="button"
            aria-pressed={enabled}
            aria-label={label}
            onClick={() => setEnabled((previous) => !previous)}
            className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full border transition-colors duration-200  ${
                enabled ? "bg-green" : "border-gray/30 bg-gray"
            }`}
        >
            <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    enabled ? "translate-x-6" : "translate-x-1"
                }`}
            />
        </button>
    )

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
                            {renderToggle(toggleEmail, setToggleEmail, "Alternar notificações por email")}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                            <div>
                                <p className="font-medium text-deep-blue">Notificações Push</p>
                                <p className="text-xs text-gray">Alertas em tempo real</p>
                            </div>
                            {renderToggle(togglePush, setTogglePush, "Alternar notificações push")}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                            <div>
                                <p className="font-medium text-deep-blue">Promoções e Ofertas</p>
                                <p className="text-xs text-gray">Fique por diante das novidades</p>
                            </div>
                            {renderToggle(togglePromotions, setTogglePromotions, "Alternar promoções e ofertas")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountNotificationsPanel
