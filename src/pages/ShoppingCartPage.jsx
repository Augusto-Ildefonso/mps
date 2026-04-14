import { useCallback, useEffect, useState } from "react"
import { LuArrowLeft } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import NavBar from "../component/NavBar/NavBar"
import ProductShoppingCartCard from "../component/ProductShoppingCartCard/ProductShoppingCartCard"
import { mockReq } from "../mock"
import { cart } from "../services/Cart"

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const navigate = useNavigate()

    const syncCartItems = useCallback(() => {
        const productsById = new Map(mockReq.map((product) => [product.id, product]))

        const syncedItems = cart
            .getItems()
            .map((cartItem) => {
                const product = productsById.get(cartItem.id)

                if (!product) {
                    return null
                }

                return {
                    ...product,
                    number: cartItem.number,
                }
            })
            .filter(Boolean)

        setCartItems(syncedItems)
    }, [])

    useEffect(() => {
        syncCartItems()
    }, [syncCartItems])

    const handleCheckout = () => {
        // Lógica do checkout
        navigate("/checkout/address")
    }

    const handleIncreaseProduct = (productId) => {
        cart.addItem(productId)
        syncCartItems()
    }

    const handleDecreaseProduct = (productId) => {
        cart.decreaseItem(productId)
        syncCartItems()
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    return(
        <div className="h-[100dvh] flex flex-col overflow-hidden w-full">
            <header className="grid grid-cols-3 items-center px-4 py-2 shadow shrink-0">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={handleGoBack}
                    className="hidden md:inline-flex justify-self-start items-center justify-center text-3xl text-deep-blue"
                >
                    <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
                <div className="justify-self-center flex justify-center items-center col-span-3 md:col-span-1">
                    <h1 className="font-bold text-2xl">Carrinho</h1>
                </div>
                <span className="hidden md:block" aria-hidden="true" />
            </header>
            <div className="flex flex-col items-center gap-5 flex-1 overflow-hidden px-4 pt-5">
                <button className="w-1/3 p-2 bg-orange rounded-3xl active:scale-95 duration shrink-0" onClick={handleCheckout}>
                    <p>Finalizar pedido</p>
                </button>
                <div className="flex-1 w-full overflow-y-auto pb-20">
                    {cartItems.map((element) => (
                        <ProductShoppingCartCard
                            key={element.id}
                            id={element.id}
                            productName={element.name}
                            price={`R$ ${element.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            imageUrl={element.url}
                            imageAlt={element.alt}
                            number={element.number}
                            onIncrease={handleIncreaseProduct}
                            onDecrease={handleDecreaseProduct}
                        />
                    ))}
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default ShoppingCartPage