import CardButton from "../CardButton/CardButton"
import { useNavigate } from "react-router-dom"

const ProductSearchCard = (props) => {
    const navigate = useNavigate()
    
    const handleCardClick = (productId) => {
        navigate("/product")
        //navigate(`/product/?${productId}`)
    }

    return(
        <div 
        className="w- h-25 flex flex-row justify-start shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] rounded-xl p-3"
        onClick={() => handleCardClick()}
        >
            <div className="flex flex-row w-full mt-5">
                <div className="w-2/5 flex justify-center items-center">
                    <img src={props.imageUrl} alt={props.imageAlt} className="w-auto object-contain"/>
                </div>

                <div className="w-3/5 ml-5">
                    <h1 className="font-extrabold">{props.productName}</h1>
                    <p className="font-bold">{props.price}</p>
                </div>
            </div>
            <CardButton className="self-center"/>
        </div>
    )
}

export default ProductSearchCard