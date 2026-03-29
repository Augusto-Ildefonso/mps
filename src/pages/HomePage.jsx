import { LuAlignJustify, LuHouse, LuPalette, LuSearch, LuShoppingCart, LuSpeaker, LuTruck, LuUser, LuZap } from "react-icons/lu"
import logo from "../assets/logo.jpeg"
import motor from "../assets/motor.jpg"
import Carousel from "../component/carousel/Carousel"
import ProductCard from "../component/ProductCard/ProductCard"



const HomePage = () => {
    return(
        <>
        <div className="grid grid-rows-[auto_auto_1fr] min-h-screen w-auto p-2 gap-8 pb-20">
            <header className="flex items-center gap-4 px-4 py-2">
                <LuAlignJustify className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                <div className="flex-1 flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain"/>
                </div>
                <LuShoppingCart className="text-3xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
            </header>
            <section className="flex justify-center items-center">
                <Carousel imagesUrl={[motor, motor]} imagesAlt={["Motor", "Motor"]}/>
            </section>
            <section className="flex flex-row justify-center gap-x-10">
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue">
                    <LuZap className="text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p>Elétrica</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue">
                    <LuSpeaker className="text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p>Som</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue">
                    <LuPalette className="text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p>Exterior</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue">
                    <LuTruck className="text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p>Utilitários</p>
                </div>
                
            </section>
            <section className="flex flex-col items-center">
                <h1 className="font-extrabold text-3xl">Produtos em Destaque</h1>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <ProductCard productName="Motor V8" price="R$2000,00" productImage={motor}/>
                    <ProductCard productName="Motor V8" price="R$2000,00" productImage={motor}/>
                    <ProductCard productName="Motor V8" price="R$2000,00" productImage={motor}/>
                    <ProductCard productName="Motor V8" price="R$2000,00" productImage={motor}/>
                </div>
            </section>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-50 h-16 bg-full-white shadow-[0_-4px_14px_rgba(15,23,42,0.12)] flex flex-row justify-around items-center">
            <LuHouse className="text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
            <LuSearch className="text-4xl shrink-0 stroke-gray active:stroke-light-blue transition duration-300 active:scale-95"/>
            <LuShoppingCart className="text-4xl shrink-0 stroke-gray active:stroke-light-blue transition duration-300 active:scale-95"/>
            <LuUser className="text-4xl shrink-0 stroke-gray active:stroke-light-blue transition duration-300 active:scale-95"/>
        </nav>
        </>
    );
}

export default HomePage