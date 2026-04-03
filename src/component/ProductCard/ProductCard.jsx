import { FaCartPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const ProductCard = (props) => {
    const navigate = useNavigate()
    
    const handleCardClick = (productId) => {
        navigate("/product")
        //navigate(`/product/?${productId}`)
    }

    return(
        <div className="flex flex-col w-40 h-auto shadow-xl rounded-xl p-4 gap-y-1"
        onClick={() => handleCardClick()}
        >
            <div className="w-7/8 flex-1 flex justify-center items-center">
                <img src={props.productImage} alt={props.imageAlt} className="w-auto object-contain"/>
            </div>
            <p className="font-extrabold text-lg text-deep-blue">{props.productName}</p>
            <div className="flex flex-row justify-between items-center">
                <p className="font-bold">{props.price}</p>
                <FaCartPlus className="text-2xl shrink-0 stroke-deep-blue active:text-light-blue"/>
            </div>
        </div>
    );
}

export default ProductCard