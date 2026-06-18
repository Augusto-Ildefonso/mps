import { useEffect, useState } from "react"
import { LuArrowLeft, LuShoppingCart } from "react-icons/lu"
import { useNavigate, useParams } from "react-router-dom"
import CardButton from "../component/CardButton/CardButton"
import logo from "../assets/logo.jpeg"
import BannerNav from "../component/NavBar/BannerNav"
import Navbar from "../component/NavBar/NavBar"
import { getProduct, listProductImages, getProductImageUrl } from "../services/api/products"

const ProductPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const [prod, imgs] = await Promise.all([
                    getProduct(id),
                    listProductImages(id),
                ])
                setProduct(prod)
                setImages(imgs)
            } catch (err) {
                setError(err.message ?? "Produto não encontrado.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    const handleBack = () => navigate(-1)

    const primaryImageUrl =
        images.length > 0 ? getProductImageUrl(images[0].path) : null

    return (
        <div className="flex flex-col justify-center">
            <header className="grid grid-cols-3 items-center px-4 py-2">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={handleBack}
                    className="justify-self-start inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
                <div className="justify-self-center flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain" />
                </div>
                <button
                    type="button"
                    aria-label="Carrinho"
                    className="justify-self-end inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
            </header>

            <BannerNav />

            {loading && (
                <p className="p-10 text-center text-gray">Carregando produto...</p>
            )}

            {error && (
                <p className="p-10 text-center text-red">{error}</p>
            )}

            {!loading && !error && product && (
                <section className="flex flex-col p-5">
                    <h1 className="text-3xl font-extrabold">{product.Descricao}</h1>
                    <div className="w-full h-full bg-light-gray p-5 rounded mt-3 flex justify-center">
                        {primaryImageUrl ? (
                            <img
                                src={primaryImageUrl}
                                alt={product.Descricao}
                                className="rounded max-h-64 object-contain"
                            />
                        ) : (
                            <div className="w-full h-40 flex items-center justify-center text-gray text-sm">
                                Sem imagem
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-around gap-3 mt-5">
                        <h2 className="text-4xl font-bold">
                            Por: R${parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>
                        <CardButton className="self-center" productId={product.Idproduto} />
                    </div>
                    <div className="mt-5 rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-3">
                        <h2 className="font-bold text-xl">Marca</h2>
                        <p className="text-lg">{product.Marca}</p>
                        {product.Num_fab && (
                            <>
                                <h2 className="mt-5 font-bold text-xl">Referência</h2>
                                <p className="text-lg">{product.Num_fab}</p>
                            </>
                        )}
                        {product.descricao && (
                            <>
                                <h2 className="mt-5 font-bold text-xl">Descrição</h2>
                                <p className="text-lg">{product.descricao}</p>
                            </>
                        )}
                        <h2 className="mt-5 font-bold text-xl">Estoque</h2>
                        <p className="text-lg">{product.estoque} {product.idunidade}</p>
                    </div>
                </section>
            )}

            <Navbar />
        </div>
    )
}

export default ProductPage
