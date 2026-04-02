import { LuAlignJustify, LuPalette, LuShoppingCart, LuSpeaker, LuTruck, LuZap } from "react-icons/lu"
import motor from "../assets/motor.jpg"
import Carousel from "../component/carousel/Carousel"
import ProductCard from "../component/ProductCard/ProductCard"
import Navbar from "../component/NavBar/NavBar"
import Header from "../component/Header/Header"



const HomePage = () => {
    return(
        <>
        <div className="grid grid-rows-[auto_auto_1fr] min-h-screen w-auto p-2 gap-8 pb-20">
            <Header />
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
        <Navbar />
        </>
    );
}

export default HomePage