import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutAddressCard from "../../component/CheckoutAddressCard/CheckoutAddressCard"
import Button from "../../component/GeneralButton/Button"
import Header from "../../component/Header/Header"
import NavBar from "../../component/NavBar/NavBar"
import { mockAddress } from "../../mock"

const CheckoutAddressPage = () => {
    const navigate = useNavigate()
    const [selectedAddressId, setSelectedAddressId] = useState(mockAddress[0]?.id ?? null)

    const selectedAddress = useMemo(
        () => mockAddress.find((address) => address.id === selectedAddressId),
        [selectedAddressId]
    )

    const handleProceed = () => {
        if (!selectedAddress) {
            return
        }

        navigate("/checkout/payment", { state: { address: selectedAddress } })
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-slate-50">
            <Header showBackButton backTo="/shoppingcart" showCartButton={false} />
            <main className="flex-1 px-4 py-5 pb-24">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Checkout</p>
                        <h1 className="text-2xl font-extrabold text-deep-blue">Selecione o endereço de entrega</h1>
                        <p className="text-sm text-gray">Escolha onde seu pedido será entregue antes de prosseguir para o pagamento.</p>
                    </section>

                    <section className="flex flex-col gap-3">
                        {mockAddress.map((address) => (
                            <CheckoutAddressCard
                                key={address.id}
                                address={address}
                                selected={address.id === selectedAddressId}
                                onSelect={() => setSelectedAddressId(address.id)}
                            />
                        ))}
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <p className="text-sm font-medium text-deep-blue">Endereço selecionado</p>
                        <p className="mt-1 text-sm text-gray">
                            {selectedAddress
                                ? `${selectedAddress.name} - ${selectedAddress.street}, ${selectedAddress.number} - ${selectedAddress.city}/${selectedAddress.state}`
                                : "Selecione um endereço para continuar."}
                        </p>
                    </section>

                    <Button
                        onClick={handleProceed}
                        bg_color="bg-orange"
                        text="Prosseguir"
                        disabled={!selectedAddress}
                    />
                </div>
            </main>
            <NavBar />
        </div>
    )
}

export default CheckoutAddressPage
