const ProductShoppingCartCard = (props) => {
    return(
        <div 
        className="w- h-25 flex flex-row justify-start shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] rounded-xl p-3"
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
            <div className="flex flex-row gap-3 justify-center items-center self-center">
                <button
                    type="button"
                    className="w-5 h-5 p-4 text-2xl bg-gray flex justify-center items-center rounded border-2 border-dark-gray active:scale-95"
                    onClick={() => props.onDecrease(props.id)}
                >
                    -
                </button>
                <p>{props.number}</p>
                <button
                    type="button"
                    className="w-5 h-5 p-4 text-2xl bg-gray flex justify-center items-center rounded border-2 border-dark-gray active:scale-95"
                    onClick={() => props.onIncrease(props.id)}
                >
                    +
                </button>
            </div>
        </div>
    )
}

export default ProductShoppingCartCard