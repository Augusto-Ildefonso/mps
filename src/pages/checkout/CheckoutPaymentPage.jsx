import { useMemo, useState } from "react"
import { LuCreditCard, LuLockKeyhole } from "react-icons/lu"
import { SiAmericanexpress, SiDiscover, SiMastercard, SiVisa } from "react-icons/si"
import { useLocation, useNavigate } from "react-router-dom"
import TextField from "../../component/Auth/TextField"
import Button from "../../component/GeneralButton/Button"
import Header from "../../component/Header/Header"

const CheckoutPaymentPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const selectedAddress = location.state?.address
    const [activeMethod, setActiveMethod] = useState(null)
    const [cardNumber, setCardNumber] = useState("")
    const [cardHolder, setCardHolder] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")

    const cardBrand = useMemo(() => {
        const digits = cardNumber.replace(/\D/g, "")

        if (/^4/.test(digits)) {
            return { name: "Visa", icon: SiVisa }
        }

        if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(digits)) {
            return { name: "Mastercard", icon: SiMastercard }
        }

        if (/^3[47]/.test(digits)) {
            return { name: "American Express", icon: SiAmericanexpress }
        }

        if (/^(6011|65|64[4-9])/.test(digits)) {
            return { name: "Discover", icon: SiDiscover }
        }

        return { name: "Bandeira automática", icon: null }
    }, [cardNumber])

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 16)
        return digits.replace(/(.{4})/g, "$1 ").trim()
    }

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4)

        if (digits.length <= 2) {
            return digits
        }

        return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }

    const isLuhnValid = (digits) => {
        let sum = 0
        let shouldDouble = false

        for (let index = digits.length - 1; index >= 0; index -= 1) {
            let currentDigit = Number(digits[index])

            if (shouldDouble) {
                currentDigit *= 2

                if (currentDigit > 9) {
                    currentDigit -= 9
                }
            }

            sum += currentDigit
            shouldDouble = !shouldDouble
        }

        return sum % 10 === 0
    }

    const isExpiryValid = (value) => {
        const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/
        const match = value.match(expiryRegex)

        if (!match) {
            return false
        }

        const month = Number(match[1])
        const year = Number(match[2])
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1

        if (year < currentYear) {
            return false
        }

        if (year === currentYear && month < currentMonth) {
            return false
        }

        return true
    }

    const cardDigits = cardNumber.replace(/\D/g, "")
    const normalizedCardHolder = cardHolder.trim().replace(/\s+/g, " ")
    const expectedCardLength = cardBrand.name === "American Express" ? 15 : 16
    const expectedCvvLength = cardBrand.name === "American Express" ? 4 : 3

    const isCardNumberValid =
        cardDigits.length === expectedCardLength && isLuhnValid(cardDigits)
    const isCardHolderValid = /^[A-ZÀ-Ý][A-ZÀ-Ý\s'.-]+$/.test(normalizedCardHolder) && normalizedCardHolder.includes(" ")
    const isExpiryFieldValid = isExpiryValid(expiry)
    const isCvvValid = new RegExp(`^\\d{${expectedCvvLength}}$`).test(cvv)

    const canProceed =
        activeMethod === "pix" ||
        (activeMethod === "card" && isCardNumberValid && isCardHolderValid && isExpiryFieldValid && isCvvValid)

    const proceedHint =
        activeMethod == null
            ? "Selecione um método de pagamento para prosseguir."
            : activeMethod === "card" && !canProceed
              ? "Preencha um cartão válido: número, nome, validade e CVV."
              : ""

    const handleProceed = () => {
        if (!canProceed) {
            return
        }

        const cardDigits = cardNumber.replace(/\D/g, "")

        navigate("/checkout/review", {
            state: {
                address: selectedAddress,
                paymentMethod: activeMethod,
                cardBrand: cardBrand.name,
                cardLast4: cardDigits.slice(-4) || "0000",
            },
        })
    }

    const previewNumber = cardNumber || "0000 0000 0000 0000"
    const previewHolder = cardHolder || "NOME IMPRESSO NO CARTÃO"
    const previewExpiry = expiry || "MM/AA"
    const BrandIcon = cardBrand.icon

    return (
        <div className="min-h-[100dvh] flex flex-col bg-slate-50">
            <Header showBackButton backTo="/checkout/address" showCartButton={false} />
            <main className="flex-1 px-4 py-5 pb-10">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">Checkout</p>
                        <h1 className="text-2xl font-extrabold text-deep-blue">Pagamento com cartão</h1>
                        <p className="text-sm text-gray">Preencha os dados abaixo para concluir o pedido com cartão de crédito.</p>
                    </section>

                    <section className="rounded-xl bg-full-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.06)]">
                        <p className="text-sm font-medium text-deep-blue">Endereço escolhido</p>
                        <p className="mt-1 text-sm text-gray">
                            {selectedAddress
                                ? `${selectedAddress.name} - ${selectedAddress.street}, ${selectedAddress.number} - ${selectedAddress.city}/${selectedAddress.state}`
                                : "Nenhum endereço recebido."}
                        </p>
                    </section>

                    <section className="flex flex-col gap-3">
                        <article className="overflow-hidden rounded-3xl bg-full-white shadow-[0_4px_14px_rgba(15,23,42,0.08)]">
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition ${activeMethod === "pix" ? "bg-orange/5" : ""}`}
                                onClick={() => setActiveMethod("pix")}
                                aria-pressed={activeMethod === "pix"}
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-deep-blue">Pix</h2>
                                    <p className="text-sm text-gray">Pagamento instantâneo via QR Code.</p>
                                </div>
                                <div className={`flex h-8 min-w-24 items-center justify-center rounded-full border px-3 text-sm font-bold transition ${activeMethod === "pix" ? "border-orange bg-orange text-full-white" : "border-slate-300 text-deep-blue"}`}>
                                    {activeMethod === "pix" ? "Selecionado" : "Selecionar"}
                                </div>
                            </button>
                        </article>

                        <article className="overflow-hidden rounded-3xl bg-full-white shadow-[0_4px_14px_rgba(15,23,42,0.08)]">
                            <button
                                type="button"
                                className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition ${activeMethod === "card" ? "bg-orange/5" : ""}`}
                                onClick={() => setActiveMethod("card")}
                                aria-pressed={activeMethod === "card"}
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-deep-blue">Cartão de crédito</h2>
                                    <p className="text-sm text-gray">Clique para preencher os dados do cartão.</p>
                                </div>
                                <div className={`flex h-8 min-w-24 items-center justify-center rounded-full border px-3 text-sm font-bold transition ${activeMethod === "card" ? "border-orange bg-orange text-full-white" : "border-slate-300 text-deep-blue"}`}>
                                    {activeMethod === "card" ? "Selecionado" : "Selecionar"}
                                </div>
                            </button>

                            {activeMethod === "card" ? (
                                <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
                                        <section className="rounded-3xl bg-gradient-to-br from-deep-blue via-[#14386b] to-[#0f172a] p-5 text-full-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Cartão de crédito</p>
                                                    <p className="mt-2 text-lg font-semibold">{previewHolder}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 text-right">
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                                                        {BrandIcon ? <BrandIcon className="text-base" /> : <LuCreditCard className="text-base" />}
                                                        {cardBrand.name}
                                                    </span>
                                                    <span className="text-xs text-white/70">Pagamento seguro</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-end justify-between gap-3">
                                                <div className="h-9 w-12 rounded-md bg-white/20" aria-hidden="true" />
                                                <div className="text-right">
                                                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">Número</p>
                                                    <p className="mt-1 font-mono text-lg tracking-[0.22em] sm:text-xl">{previewNumber}</p>
                                                </div>
                                            </div>

                                            <div className="mt-7 flex items-end justify-between gap-4">
                                                <div>
                                                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">Validade</p>
                                                    <p className="mt-1 font-mono text-base tracking-[0.2em]">{previewExpiry}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">CVV</p>
                                                    <p className="mt-1 font-mono text-base tracking-[0.2em]">{cvv || "•••"}</p>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-deep-blue">Dados do cartão</h3>
                                                <p className="text-sm text-gray">Os campos abaixo seguem o padrão comum de checkout.</p>
                                            </div>
                                            <div className="flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-sm font-medium text-orange">
                                                {BrandIcon ? <BrandIcon className="text-base" /> : <LuCreditCard className="text-base" />}
                                                {cardBrand.name}
                                            </div>
                                        </div>

                                        <TextField
                                            id="card-number"
                                            name="card-number"
                                            label="Número do cartão"
                                            placeholder="0000 0000 0000 0000"
                                            inputMode="numeric"
                                            autoComplete="cc-number"
                                            value={cardNumber}
                                            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                                        />
                                        {!isCardNumberValid && cardDigits.length > 0 ? (
                                            <p className="-mt-2 text-sm text-red">Número de cartão inválido.</p>
                                        ) : null}

                                        <TextField
                                            id="card-holder"
                                            name="card-holder"
                                            label="Nome impresso no cartão"
                                            placeholder="Como aparece no cartão"
                                            autoComplete="cc-name"
                                            value={cardHolder}
                                            onChange={(event) => setCardHolder(event.target.value.toUpperCase())}
                                        />
                                        {!isCardHolderValid && normalizedCardHolder.length > 0 ? (
                                            <p className="-mt-2 text-sm text-red">Informe nome e sobrenome como no cartão.</p>
                                        ) : null}

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <TextField
                                                id="expiry"
                                                name="expiry"
                                                label="Validade"
                                                placeholder="MM/AA"
                                                inputMode="numeric"
                                                autoComplete="cc-exp"
                                                value={expiry}
                                                onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                                            />
                                            {!isExpiryFieldValid && expiry.length > 0 ? (
                                                <p className="-mt-2 text-sm text-red">Data de validade inválida.</p>
                                            ) : null}
                                            <TextField
                                                id="cvv"
                                                name="cvv"
                                                label="CVV"
                                                placeholder="123"
                                                inputMode="numeric"
                                                autoComplete="cc-csc"
                                                value={cvv}
                                                onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                                            />
                                            {!isCvvValid && cvv.length > 0 ? (
                                                <p className="-mt-2 text-sm text-red">CVV inválido para a bandeira do cartão.</p>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-deep-blue">
                                                <input type="checkbox" className="h-4 w-4 accent-orange" />
                                                Salvar cartão para próximas compras
                                            </label>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-gray">
                                            <div className="flex items-start gap-3">
                                                <LuLockKeyhole className="mt-0.5 text-xl text-orange" />
                                                <p>Seus dados são usados apenas para esta compra.</p>
                                            </div>
                                        </div>

                                </div>
                            ) : null}
                        </article>
                    </section>

                    <Button
                        onClick={handleProceed}
                        bg_color="bg-orange"
                        text="Prosseguir"
                        disabled={!canProceed}
                    />
                    {proceedHint ? <p className="text-sm text-red">{proceedHint}</p> : null}
                </div>
            </main>
        </div>
    )
}

export default CheckoutPaymentPage
