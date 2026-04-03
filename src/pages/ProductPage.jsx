import { LuArrowLeft, LuShoppingCart } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import CardButton from "../component/CardButton/CardButton"
import logo from "../assets/logo.jpeg"
import motor from "../assets/motor.jpg"

// Forçando construir com um product mock mas na realidade faria a busca pelos dados no servidor
const mockProduct = {
    "id": 1,
    "name": "Motor Turbo v8 1.5",
    "brand": "Corolla",
    "description": "Um motor turbo v8 de 1.5L que faz de 0 a 100 em 20 segundos. Compátivel com carros da corolla a partir de 2010.",
    "price": 1000.0,
    "imageUrl": motor,
    "imageAlt": "Foto de motor"
}

const ProductPage = (props) => {
    const navigate = useNavigate()

    const handleBack = () =>{
        navigate(-1)
    }

    const getProductDate = () => {
        // Lógica para buscar os dados do produto no back e montar a página. 
        // Se obter algo então retorna a página, se não retorna uma página de erro 404.
    }

    return(
        <div className="flex flex-col justify-center">
            <header className="grid grid-cols-3 items-center px-4 py-2">
                <button
                    type="button"
                    aria-label="Voltar"
                    onClick={handleBack}
                    className="justify-self-start inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuArrowLeft className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95  " />
                </button>
                <div className="justify-self-center flex justify-center">
                    <img src={logo} alt="MPS Logo" className="h-20 w-auto object-contain"/>
                </div>
                <button
                    type="button"
                    aria-label="Carrinho"
                    className="justify-self-end inline-flex items-center justify-center text-3xl shrink-0 text-deep-blue"
                >
                    <LuShoppingCart className="shrink-0 stroke-current active:text-light-blue transition duration-300 active:scale-95" />
                </button>
            </header>

            <section className="flex flex-col p-5">
                <h1 className="text-3xl font-extrabold ">{mockProduct.name}</h1>
                <div className="w-full h-full bg-light-gray p-5 rounded mt-3">
                    <img src={mockProduct.imageUrl} alt={mockProduct.imageAlt} className="rounded" />
                </div>
                <div className="flex flex-col justify-around gap-3 mt-5">
                    <h2 className="text-4xl font-bold">Por: R${mockProduct.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <CardButton className="self-center" productId={mockProduct.id}/>
                </div>
                <div className="mt-5 rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-3">
                    <h2 className="font-bold text-xl">Marca</h2>
                    <p className="text-lg">{mockProduct.brand}</p>
                    <h2 className="mt-5 font-bold text-xl">Descrição</h2>
                    <p className="text-lg">{mockProduct.description}</p>
                </div>

            </section>
        </div>
    )
}

export default ProductPage