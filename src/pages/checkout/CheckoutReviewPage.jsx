import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../../component/GeneralButton/Button"
import Header from "../../component/Header/Header"
import Alert from "../../component/Alert/Alert"
import { cart } from "../../services/Cart"
import { getProduct } from "../../services/api/products"
import { createOrder } from "../../services/api/orders"

const CheckoutReviewPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const checkoutState = location.state ?? {}

    const selectedAddress = checkoutState.address
    const paymentMethod = checkoutState.paymentMethod ?? "pix"
    const cardBrand = checkoutState.cardBrand ?? "Cartão"
    const cardLast4 = checkoutState.cardLast4 ?? "0000"

    const [cartItems, setCartItems] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderError, setOrderError] = useState(null)
    const [alertVisible, setAlertVisible] = useState(false)

    useEffect(() => {
        const loadItems = async () => {
            const items = cart.getItems()
            const resolved = await Promise.all(
                items.map(async (item) => {
                    try {
                        const product = await getProduct(item.id)
                        return {
                            id: product.Idproduto,
                            name: product.Descricao,
                            price: parseFloat(product.VLR_VENDA1),
                            quantity: item.number,
                            subtotal: parseFloat(product.VLR_VENDA1) * item.number,
                        }
                    } catch {
                        return null
                    }
                })
            )
            const valid = resolved.filter(Boolean)
            setCartItems(valid)
            setTotal(valid.reduce((sum, item) => sum + item.subtotal, 0))
            setLoading(false)
        }
        loadItems()
    }, [])

    const paymentLabel =
        paymentMethod === "card" ? `${cardBrand} final ${cardLast4}` : "Pix"

    const formatCurrency = (value) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })

    const handleFinishOrder = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        setOrderError(null)
        try {
            const items = cart.getItems().map((item) => ({
                id_product: Number(item.id),
                quantity: item.number,
            }))
            await createOrder({ items })
            cart.clear()
            navigate("/account/orders")
        } catch (err) {
            const message = err.items
                ? `${err.message}: ${err.items.map((i) => `Produto #${i.id_product} — ${i.reason}`).join("; ")}`
                : (err.message ?? "Erro ao finalizar pedido.")
            setOrderError(message)
            setAlertVisible(true)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-slate-50">
            <Header showBackButton backTo="/checkout/payment" showCartButton={false} />
            <main className="flex-1 px-4 py-5 pb-10">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Checkout</p>
                        <h1 className="text-2xl font-extrabold text-deep-blue">Finalizar pedido</h1>
                        <p className="text-sm text-gray">Confira os dados do pedido antes de concluir.</p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Itens do carrinho</h2>
                        {loading ? (
                            <p className="mt-2 text-sm text-gray">Carregando itens...</p>
                        ) : cartItems.length > 0 ? (
                            <div className="mt-3 flex flex-col gap-3">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-bold text-deep-blue">{item.name}</p>
                                                <p className="text-sm text-gray">Qtd: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-deep-blue">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-gray">Seu carrinho está vazio.</p>
                        )}
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Endereço de entrega</h2>
                        <p className="mt-2 text-sm text-gray">
                            {selectedAddress
                                ? `${selectedAddress.name} — ${selectedAddress.street}, ${selectedAddress.number} — ${selectedAddress.city}/${selectedAddress.state}`
                                : "Endereço não informado."}
                        </p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <h2 className="text-lg font-bold text-deep-blue">Método de pagamento</h2>
                        <p className="mt-2 text-sm text-gray">{paymentLabel}</p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray">Total do pedido</p>
                            <p className="text-xl font-extrabold text-deep-blue">{formatCurrency(total)}</p>
                        </div>
                    </section>

                    <Button
                        onClick={handleFinishOrder}
                        bg_color="bg-orange"
                        text={isSubmitting ? "Enviando..." : "Finalizar pedido"}
                    />
                </div>
            </main>

            <Alert
                isVisible={alertVisible}
                message={orderError ?? ""}
                duration={6000}
                onClose={() => setAlertVisible(false)}
            />
        </div>
    )
}

export default CheckoutReviewPage
