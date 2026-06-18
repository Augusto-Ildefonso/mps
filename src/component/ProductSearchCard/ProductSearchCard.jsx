import { useNavigate } from "react-router-dom"
import CardButton from "../CardButton/CardButton"

const ProductSearchCard = (props) => {
    const navigate = useNavigate()

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`)
    }

    return (
        <div className="w-full h-auto flex flex-col md:flex-row justify-start shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] rounded-xl p-3 gap-3 md:gap-4">
            <div
                className="w-full md:w-2/5 flex justify-center items-center bg-light-gray rounded-md p-4"
                onClick={() => handleCardClick(props.id)}
            >
                {props.imageUrl ? (
                    <img
                        src={props.imageUrl}
                        alt={props.imageAlt}
                        className="w-full max-w-[200px] h-auto object-contain"
                    />
                ) : (
                    <div className="w-full max-w-[200px] h-24 flex items-center justify-center text-gray text-xs">
                        Sem imagem
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-row md:flex-col justify-between items-start md:items-start w-full gap-2">
                    <div className="flex-1" onClick={() => handleCardClick(props.id)}>
                        <h1 className="font-extrabold text-base md:text-md">{props.productName}</h1>
                        <p className="font-bold text-base md:text-md text-deep-blue mt-1">{props.price}</p>
                    </div>
                    <CardButton className="self-center md:self-auto" productId={props.id} />
                </div>
            </div>
        </div>
    )
}

export default ProductSearchCard
