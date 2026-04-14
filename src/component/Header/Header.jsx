import { LuArrowLeft, LuShoppingCart } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

import logo from "../../assets/logo.jpeg"

const Header = ({ showBackButton = false, backTo, showCartButton = true }) => {
    const navigate = useNavigate()

    const handleBack = () => {
        if (backTo) {
            navigate(backTo)
            return
        }

        navigate(-1)
    }

    return(
        <header className="grid grid-cols-3 items-center gap-4 px-4 py-2 bg-full-white shadow-[0_4px_14px_rgba(15,23,42,0.08)] relative z-10">
            <div className="flex items-center justify-start">
                {showBackButton ? (
                    <button
                        type="button"
                        aria-label="Voltar"
                        onClick={handleBack}
                        className="inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                    >
                        <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                    </button>
                ) : (
                    <span className="h-8 w-8" aria-hidden="true" />
                )}
            </div>
            <div className="flex justify-center">
                <img src={logo} alt="MPS Logo" className="h-16 sm:h-18 lg:h-20 w-auto object-contain"/>
            </div>
            <div className="flex justify-end">
                {showCartButton ? (
                    <button
                        type="button"
                        aria-label="Carrinho"
                        className="inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                        onClick={() => {navigate("/shoppingcart")}}
                    >
                        <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                    </button>
                ) : (
                    <span className="h-8 w-8" aria-hidden="true" />
                )}
            </div>
        </header>
    )
}

export default Header