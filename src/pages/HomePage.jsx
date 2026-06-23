import { useEffect, useState } from "react"
import { LuPalette, LuSpeaker, LuTruck, LuZap } from "react-icons/lu"
import motor from "../assets/motor.jpg"
import Carousel from "../component/Carousel/Carousel"
import Header from "../component/Header/Header"
import Navbar from "../component/NavBar/NavBar"
import ProductCard from "../component/ProductCard/ProductCard"
import BannerNav from "../component/NavBar/BannerNav"
import { listProducts, listProductImages, getProductImageUrl } from "../services/api/products"
import { getRandomMockImage } from "../services/mockImages"

const HomePage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await listProducts(8)
                const withImages = await Promise.allSettled(
                    data.map(async (p) => {
                        let imageUrl = getRandomMockImage()
                        try {
                            const images = await listProductImages(p.Idproduto)
                            if (images.length > 0) {
                                imageUrl = getProductImageUrl(images[0].path)
                            }
                        } catch {
                            // keep default mock image
                        }
                        return { ...p, imageUrl }
                    })
                )
                setProducts(withImages.map((r) => (r.status === "fulfilled" ? r.value : null)).filter(Boolean))
            } catch (err) {
                setError(err.message ?? "Erro ao carregar produtos.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

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
                {loading && (
                    <p className="mt-4 text-sm text-gray">Carregando produtos...</p>
                )}
                {error && (
                    <p className="mt-4 text-sm text-red">{error}</p>
                )}
                {!loading && !error && products.length === 0 && (
                    <p className="mt-4 text-sm text-gray">Nenhum produto encontrado.</p>
                )}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4 w-full max-w-6xl">
                        {
                            products.map(element => (
                                <ProductCard
                                    key={element.Idproduto}
                                    id={element.Idproduto}
                                    productName={element.Descricao}
                                    price={`R$ ${parseFloat(element.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    productImage={element.imageUrl}
                                    imageAlt={element.Descricao}
                                />
                            ))
                        }
                    </div>
                )}
            </section>
        </div>
        <Navbar />
        </>
    );
}

export default HomePage