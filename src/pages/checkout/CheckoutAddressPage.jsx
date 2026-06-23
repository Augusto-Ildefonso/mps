import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CheckoutAddressCard from "../../component/CheckoutAddressCard/CheckoutAddressCard"
import Button from "../../component/GeneralButton/Button"
import Header from "../../component/Header/Header"
import NavBar from "../../component/NavBar/NavBar"
import { listAddresses } from "../../services/api/users"

const CheckoutAddressPage = () => {
    const navigate = useNavigate()
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedAddressId, setSelectedAddressId] = useState(null)

    useEffect(() => {
        listAddresses()
            .then((data) => {
                setAddresses(data)
                if (data.length > 0) setSelectedAddressId(data[0].id)
            })
            .catch(() => setAddresses([]))
            .finally(() => setLoading(false))
    }, [])

    const selectedAddress = useMemo(
        () => addresses.find((address) => address.id === selectedAddressId),
        [selectedAddressId, addresses]
    )

    const handleProceed = () => {
        if (!selectedAddress) return
        navigate("/checkout/payment", { state: { address: selectedAddress } })
    }

    if (loading) {
        return (
            <div className="min-h-[100dvh] flex flex-col bg-slate-50">
                <Header showBackButton backTo="/shoppingcart" showCartButton={false} />
                <main className="flex-1 px-4 py-5 pb-24 flex items-center justify-center">
                    <p className="text-sm text-gray">Carregando endereços...</p>
                </main>
                <NavBar />
            </div>
        )
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

                    {addresses.length === 0 ? (
                        <section className="rounded-xl bg-full-white p-8 text-center shadow-sm">
                            <p className="text-sm text-gray">Nenhum endereço cadastrado. Adicione um endereço antes de continuar.</p>
                        </section>
                    ) : (
                        <section className="flex flex-col gap-3">
                            {addresses.map((address) => (
                                <CheckoutAddressCard
                                    key={address.id}
                                    address={address}
                                    selected={address.id === selectedAddressId}
                                    onSelect={() => setSelectedAddressId(address.id)}
                                />
                            ))}
                        </section>
                    )}

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
