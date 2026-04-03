import { useState } from "react"
import { cart } from "../../services/Cart"
import Alert from "../Alert/Alert"

const CardButton = (props) => {
    const [isAlertVisible, setIsAlertVisible] = useState(false)
    const [alertResetKey, setAlertResetKey] = useState(0)

    const handleClick = (id) => {
        if (id == null) {
            return
        }

        cart.addItem(id)
        setIsAlertVisible(true)
        setAlertResetKey((currentKey) => currentKey + 1)
    }

    return(
        <>
            <button 
                className={`w-3/6 h-8 rounded-3xl bg-dark-blue text-full-white font-bold text-xs flex justify-center items-center active:bg-light-blue active:scale-95 duration-100 ${props.className ?? ""}`}
                onClick={() => {handleClick(props.productId ?? props.id)}}
            >
                    <p>Adicionar ao carrinho</p>
            </button>
            <Alert
                isVisible={isAlertVisible}
                message="Adicionado ao carrinho!"
                duration={5000}
                resetKey={alertResetKey}
                onClose={() => setIsAlertVisible(false)}
            />
        </>
    )
}

export default CardButton