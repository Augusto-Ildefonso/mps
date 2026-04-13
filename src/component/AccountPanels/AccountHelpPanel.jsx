import { LuCircleHelp, LuMessageSquare } from "react-icons/lu"

const AccountHelpPanel = () => {
    const faqs = [
        { question: "Como acompanho meu pedido?", answer: "Acesse 'Meus Pedidos' e clique no pedido desejado para ver o status." },
        { question: "Como altero meu endereço?", answer: "Vá para 'Endereços' e edite o endereço desejado." },
        { question: "Quais formas de pagamento são aceitas?", answer: "Aceitamos cartões de crédito e débito." },
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <h2 className="text-xl font-extrabold text-deep-blue mb-4">Central de Ajuda</h2>
                
                {/* FAQs */}
                <div className="mb-6">
                    <h3 className="font-bold text-deep-blue mb-3">Perguntas Frequentes</h3>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="p-4 bg-light-gray rounded-lg">
                                <p className="font-bold text-deep-blue text-sm mb-2">{faq.question}</p>
                                <p className="text-sm text-gray">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contate o suporte */}
                <div className="flex flex-col items-center justify-center py-8 border-t border-gray pt-6">
                    <LuMessageSquare className="text-5xl mb-3 stroke-deep-blue" />
                    <p className="text-base font-medium text-deep-blue">Ainda precisa de ajuda?</p>
                    <p className="text-sm text-gray mt-1">Entre em contato com nosso suporte</p>
                    <button className="mt-4 px-6 py-3 bg-deep-blue text-white rounded-lg font-bold hover:bg-dark-blue transition active:scale-95">
                        Falar com Suporte
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AccountHelpPanel
