import { FaCartPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { cart } from "../../services/Cart"

const ProductCard = (props) => {
    const navigate = useNavigate()
    
    const handleCardClick = (productId) => {
        navigate("/product")
        //navigate(`/product/?${productId}`)
    }

    const handleCartButton = (id) => {
        cart.addItem(id)
        alert("Adicionado com sucesso")
    }

    return(
        <div className="flex flex-col w-40 h-auto shadow-xl rounded-xl p-4 gap-y-1"
        >
            <div className="w-7/8 flex-1 flex justify-center items-center"  onClick={() => handleCardClick()}>
                <img src={props.productImage} alt={props.imageAlt} className="w-auto object-contain"/>
            </div>
            <p className="font-extrabold text-lg text-deep-blue"  onClick={() => handleCardClick()}>{props.productName}</p>
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold"  onClick={() => handleCardClick()}>{props.price}</p>
                <FaCartPlus className="text-2xl shrink-0 stroke-deep-blue active:text-light-blue" onClick={() => handleCartButton(props.id)}/>
            </div>
        </div>
    );
}

export default ProductCard