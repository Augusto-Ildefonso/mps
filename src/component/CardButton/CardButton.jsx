const CardButton = (props) => {
    const handleClick = (id) => {
        // Lógica de adicionar ao carrinho
    }

    return(
        <button 
            className={`w-3/6 h-8 rounded-3xl bg-dark-blue text-full-white font-bold text-xs flex justify-center items-center active:bg-light-blue active:scale-95 duration-100 ${props.className ?? ""}`}
            onClick={() => {handleClick(props.productId)}}
        >
                <p>Adicionar ao carrinho</p>
        </button>
    )
}

export default CardButton