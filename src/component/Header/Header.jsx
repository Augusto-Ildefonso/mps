import { LuAlignJustify, LuShoppingCart } from "react-icons/lu"

import logo from "../../assets/logo.jpeg"

const Header = () => {
    

    return(
        <header className="flex flex-col gap-0 px-4 py-2">
            <div className="flex items-center gap-4">
                <LuAlignJustify className="hidden lg:block text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95 cursor-pointer"/>
                <div className="flex-1 flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-16 sm:h-18 lg:h-20 w-auto object-contain"/>
                </div>
                <button
                    type="button"
                    aria-label="Carrinho"
                    className="justify-self-end inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                    onClick={() => {navigate("/shoppingcart")}}
                >
                    <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
            </div>
            
        </header>
    )
}

export default Header