import { LuCreditCard } from "react-icons/lu"

const AccountPaymentsPanel = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-deep-blue mb-4">Formas de Pagamento</h2>
                <div className="flex flex-col items-center justify-center py-12 text-gray">
                    <LuCreditCard className="text-6xl mb-3 stroke-gray" />
                    <p className="text-base font-medium">Nenhuma forma de pagamento cadastrada</p>
                    <p className="text-sm mt-1">Adicione um cartão de crédito ou débito para fazer compras</p>
                    <button className="mt-4 px-6 py-3 bg-orange text-white rounded-lg font-bold hover:bg-orange/90 transition active:scale-95">
                        Adicionar Cartão
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountPaymentsPanel
