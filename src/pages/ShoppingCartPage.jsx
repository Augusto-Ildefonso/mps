import { useState } from "react"
import { LuArrowLeft } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import motor from "../assets/motor.jpg"
import ProductShoppingCartCard from "../component/ProductShoppingCartCard/ProductShoppingCartCard"

const mockReq = [
    {
        "id": 1,
        "name": "Motor",
        "price": 2000.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 2,
        "name": "Motor",
        "price": 5000.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 3,
        "name": "Motor",
        "price": 100.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 4,
        "name": "Motor",
        "price": 404.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 5,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 6,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 7,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
    {
        "id": 8,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor",
        "number": 1,
    },
]

const ShoppingCartPage = () => {
    const [cartItems, setCartItems] = useState(mockReq)
    const navigate = useNavigate()

    const handleBack = () => {
        navigate(-1)
    }

    const handleCheckout = () => {
        // Lógica do checkout
        navigate("/payment")
    }

    const handleIncreaseProduct = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) =>
                item.id === productId
                    ? { ...item, number: item.number + 1 }
                    : item
            )
        )
    }

    const handleDecreaseProduct = (productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === productId
                        ? { ...item, number: item.number - 1 }
                        : item
                )
                .filter((item) => item.number > 0)
        )
    }

    return(
        <div>
            <header className="grid grid-cols-3 items-center px-4 py-2 shadow">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={handleBack}
                    className="justify-self-start inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95  " />
                </button>
                <div className="justify-self-center flex justify-center items-center">
                    <h1 className="font-bold text-2xl">Carrinho</h1>
                </div>
            </header>
            <div className="flex flex-col justify-center items-center gap-5">
                <button className="w-1/3 p-2 bg-orange rounded-3xl mt-5 active:scale-95 duration" onClick={handleCheckout}>
                    <p>Finalizar pedido</p>
                </button>
                <div>
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

        </div>
    )
}

export default ShoppingCartPage