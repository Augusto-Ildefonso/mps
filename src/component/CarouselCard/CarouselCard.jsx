import React from "react"

const CarouselCard = (props) => {
    
    return(
        <div className="p-0 w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-deep-blue rounded-xl flex flex-row items-center justify-between relative overflow-hidden border-2 border-deep-blue">
            <div className="w-1/2 h-full text-white flex flex-col items-start justify-center px-4 gap-2 md:w-[40%]">
                <p className="text-xl font-extrabold text-balance 2xl:text-2xl">Conheça mais nossos produtos.</p>
                <button className="w-full h-[2.5rem] p-2 rounded bg-orange no-wrap self-center text-sm sm:text-base xl:text-lg md:h-[3rem] md:w-[60%] flex items-center justify-center gap-2">
                    <p className="font-bold leading-relaxed">Compre Agora</p>
                </button>

            </div>
            <div className="w-1/2 h-full flex items-center justify-end">
                <img src={props.img} alt={props.alt} className="h-full w-full sm:object-cover object-right object-fill"/>
            </div>
            
        </div>
    );
}

export default CarouselCard