import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../component/Header/Header"
import NavBar from "../component/NavBar/NavBar"
import ProductShoppingCartCard from "../component/ProductShoppingCartCard/ProductShoppingCartCard"
import { cart } from "../services/Cart"
import { getProduct } from "../services/api/products"
import { getRandomMockImage } from "../services/mockImages"
import BannerNav from "../component/NavBar/BannerNav"

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const syncCartItems = useCallback(async () => {
        setLoading(true)
        try {
            const items = cart.getItems()
            const resolved = await Promise.all(
                items.map(async (cartItem) => {
                    try {
                        const product = await getProduct(cartItem.id)
                        return {
                            id: product.Idproduto,
                            name: product.Descricao,
                            price: parseFloat(product.VLR_VENDA1),
                            number: cartItem.number,
                            imageUrl: getRandomMockImage(),
                        }
                    } catch {
                        return null
                    }
                })
            )
            setCartItems(resolved.filter(Boolean))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        syncCartItems()
    }, [syncCartItems])

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

    return(
        <div className="h-[100dvh] flex flex-col overflow-hidden w-full">
            
            <Header showBackButton={false} />
             <BannerNav />
            <div className="flex flex-col items-center gap-5 flex-1 overflow-hidden px-4 pt-5">
                <button className="w-1/3 p-2 bg-orange rounded-3xl active:scale-95 duration shrink-0" onClick={handleCheckout}>
                    <p>Finalizar pedido</p>
                </button>
                <div className="flex-1 w-full overflow-y-auto pb-20">
                    {loading ? (
                        <p className="text-center text-sm text-gray mt-6">Carregando itens...</p>
                    ) : cartItems.length === 0 ? (
                        <p className="text-center text-sm text-gray mt-6">Seu carrinho está vazio.</p>
                    ) : (
                        cartItems.map((element) => (
                            <ProductShoppingCartCard
                                key={element.id}
                                id={element.id}
                                productName={element.name}
                                price={`R$ ${element.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                imageUrl={element.imageUrl}
                                imageAlt={element.name}
                                number={element.number}
                                onIncrease={handleIncreaseProduct}
                                onDecrease={handleDecreaseProduct}
                            />
                        ))
                    )}
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default ShoppingCartPage