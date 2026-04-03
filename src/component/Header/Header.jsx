import { LuAlignJustify, LuShoppingCart } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.jpeg"
import ShoppingCartPage from "../../pages/ShoppingCartPage"

const Header = () => {
    const navigate = useNavigate()
    return(
        <header className="flex items-center gap-4 px-4 py-2">
            <LuAlignJustify className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
            <div className="flex-1 flex justify-center">
                <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain"/>
            </div>
            <button
                    type="button"
                    aria-label="Carrinho"
                    className="justify-self-end inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                    onClick={() => {navigate("/shoppingcart")}}
                >
                    <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
        </header>

        
    )
}

export default Header