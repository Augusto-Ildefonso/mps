import { useState } from "react"
import { FaCartPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { cart } from "../../services/Cart"
import Alert from "../Alert/Alert"

const ProductCard = (props) => {
    const navigate = useNavigate()
    const [isAlertVisible, setIsAlertVisible] = useState(false)
    const [alertResetKey, setAlertResetKey] = useState(0)
    
    const handleCardClick = (productId) => {
        navigate("/product")
        //navigate(`/product/?${productId}`)
    }

    const handleCartButton = (event, id) => {
        event.stopPropagation()

        cart.addItem(id)
        setIsAlertVisible(true)
        setAlertResetKey((currentKey) => currentKey + 1)
    }

    return(
        <div className="flex flex-col w-full h-auto shadow-xl rounded-xl p-2 sm:p-3 gap-y-1"
        >
            <div className="w-full flex-1 flex justify-center items-center"  onClick={() => handleCardClick()}>
                <img src={props.productImage} alt={props.imageAlt} className="w-full max-w-[150px] sm:max-w-[180px] h-auto object-contain"/>
            </div>
            <p className="font-extrabold text-base sm:text-lg text-deep-blue truncate"  onClick={() => handleCardClick()}>{props.productName}</p>
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold text-sm sm:text-base"  onClick={() => handleCardClick()}>{props.price}</p>
                <FaCartPlus className="text-xl sm:text-2xl shrink-0 stroke-deep-blue active:text-light-blue" onClick={(event) => handleCartButton(event, props.id)}/>
            </div>
            <Alert
                isVisible={isAlertVisible}
                message="Adicionado ao carrinho!"
                duration={5000}
                resetKey={alertResetKey}
                onClose={() => setIsAlertVisible(false)}
            />
        </div>
    );
}

export default ProductCard