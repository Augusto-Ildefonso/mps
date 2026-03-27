import React from "react"
import { LuAlignJustify, LuShoppingCart } from "react-icons/lu"
import logo from "../assets/logo.jpeg"
import CarouselCard from "../component/CarouselCard/CarouselCard"

const HomePage = () => {
    return(
        <div>
            <header className="flex items-center gap-4 px-4 py-2">
                <LuAlignJustify className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue"/>
                <div className="flex-1 flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain"/>
                </div>
                <LuShoppingCart className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue"/>
            </header>
            <section className="">
                <CarouselCard image="../assets/motor.jpg" className/>
            </section>
        </div>
    );
}

export default HomePage