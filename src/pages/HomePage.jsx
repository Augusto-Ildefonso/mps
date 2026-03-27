import React from "react"
import { LuAlignJustify, LuShoppingCart } from "react-icons/lu"
import logo from "../assets/logo.jpeg"
import motor from "../assets/motor.jpg"
import Carousel from "../component/carousel/Carousel"


const HomePage = () => {
    return(
        <div className="grid grid-rows-4 h-full w-auto p-2">
            <header className="flex items-center gap-4 px-4 py-2">
                <LuAlignJustify className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue"/>
                <div className="flex-1 flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain"/>
                </div>
                <LuShoppingCart className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue"/>
            </header>
            <section className="flex justify-center items-center">
                <Carousel imagesUrl={[motor, motor]} imagesAlt={["Motor", "Motor"]}/>
            </section>
        </div>
    );
}

export default HomePage