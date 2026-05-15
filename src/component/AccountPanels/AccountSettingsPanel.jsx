import { useNavigate } from "react-router-dom"
import { LuSettings } from "react-icons/lu"

const AccountSettingsPanel = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-deep-blue mb-4 text-center md:text-left">Configurações</h2>
                <div className="flex flex-col items-center justify-center py-12 text-gray">
                    <LuSettings className="text-6xl mb-3 stroke-gray" />
                    <p className="text-base font-medium">Configurações da Conta</p>
                    <p className="text-sm mt-1">Gerencie suas preferências e dados pessoais</p>
                    <div className="flex flex-col gap-3 mt-6 w-full max-w-md">
                        <button className="w-full px-4 py-3 bg-light-gray text-deep-blue rounded-lg font-medium hover:bg-gray transition active:scale-95 text-left">
                            Editar Dados Pessoais
                        </button>
                        <button type="button" onClick={() => navigate("/account/password")} className="w-full px-4 py-3 bg-light-gray text-deep-blue rounded-lg font-medium hover:bg-gray transition active:scale-95 text-left">
                            Alterar Senha
                        </button>
                        <button className="w-full px-4 py-3 bg-light-gray text-deep-blue rounded-lg font-medium hover:bg-gray transition active:scale-95 text-left">
                            Preferências de Privacidade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSettingsPanel
