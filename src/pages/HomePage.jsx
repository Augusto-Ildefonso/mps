import { LuPalette, LuSpeaker, LuTruck, LuZap } from "react-icons/lu"
import motor from "../assets/motor.jpg"
import Carousel from "../component/Carousel/Carousel"
import Header from "../component/Header/Header"
import Navbar from "../component/NavBar/NavBar"
import ProductCard from "../component/ProductCard/ProductCard"
import { mockReq } from "../mock"
import BannerNav from "../component/NavBar/BannerNav"



const HomePage = () => {
    return(
        <>
        <div className="grid grid-rows-[auto_auto_auto_auto] min-h-screen gap-2 sm:gap-4 lg:gap-6 px-2 sm:px-4 pb-20">
            <Header />
            <BannerNav />
            <section className="flex justify-center items-center">
                <Carousel imagesUrl={[motor, motor]} imagesAlt={["Motor", "Motor"]}/>
            </section>
            <section className="flex flex-row justify-center gap-x-4 sm:gap-x-6 lg:gap-x-10 px-2">
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue min-w-[60px]">
                    <LuZap className="text-3xl sm:text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p className="text-xs sm:text-sm">Elétrica</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue min-w-[60px]">
                    <LuSpeaker className="text-3xl sm:text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p className="text-xs sm:text-sm">Som</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue min-w-[60px]">
                    <LuPalette className="text-3xl sm:text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p className="text-xs sm:text-sm">Exterior</p>
                </div>
                <div className="flex flex-col justify-center items-center active:stroke-light-blue active:text-light-blue min-w-[60px]">
                    <LuTruck className="text-3xl sm:text-4xl shrink-0 stroke-deep-blue active:stroke-light-blue transition duration-300 active:scale-95"/>
                    <p className="text-xs sm:text-sm">Utilitários</p>
                </div>

            </section>
            <section className="flex flex-col items-center px-2 sm:px-0">
                <h1 className="font-extrabold text-2xl sm:text-3xl text-center px-2">Produtos em Destaque</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full max-w-6xl">
                    {
                        mockReq.map(element => (
                            <ProductCard
                                    key={element.id}
                                id={element.id}
                                productName={element.name}
                                price={`R$ ${element.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    productImage={element.url}
                                imageAlt={element.alt}
                            />
                        ))
                    }
                </div>
            </section>
        </div>
        <Navbar />
        </>
    );
}

export default HomePage