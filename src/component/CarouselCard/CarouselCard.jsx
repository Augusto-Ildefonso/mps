import React from "react"

const CarouselCard = (props) => {
    
    return(
        <div className="p-0 w-full h-50 bg-deep-blue rounded-xl flex flex-row items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="w-1/2 h-full text-white flex flex-col items-start justify-center px-4 gap-2">
                <p className="text-xl font-extrabold text-balance">Conheça mais nossos produtos.</p>
                <button className="w-auto h-10 p-2 rounded bg-orange">
                    <p className="font-bold">Compre Agora</p>
                </button>

            </div>
            <div className="w-1/2 h-full flex items-center justify-end">
                <img src={props.img} alt={props.alt} className="h-full w-full object-cover object-right"/>
            </div>
            
        </div>
    );
}

export default CarouselCard