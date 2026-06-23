import { useState } from "react"
import NavBar from "../component/NavBar/NavBar"
import ProductSearchCard from "../component/ProductSearchCard/ProductSearchCard"
import SearchBar from "../component/SearchBar/SearchBar"
import Header from "../component/Header/Header"
import BannerNav from "../component/NavBar/BannerNav"
import { searchProducts } from "../services/api/products"
import { getRandomMockImage } from "../services/mockImages"

const SearchPage = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (query) => {
        if (!query) return
        setLoading(true)
        setError(null)
        setHasSearched(true)
        try {
            const products = await searchProducts(query)
            setResults(products)
        } catch (err) {
            setError(err.message ?? "Erro ao buscar produtos.")
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="h-[100dvh] flex flex-col overflow-hidden w-full">
                <Header showBackButton={false} />
                <BannerNav />
                <SearchBar onSearch={handleSearch} />

                {loading && (
                    <p className="mt-6 text-center text-sm text-gray">Buscando...</p>
                )}

                {error && (
                    <p className="mt-6 text-center text-sm text-red">{error}</p>
                )}

                {!loading && hasSearched && results.length === 0 && !error && (
                    <p className="mt-6 text-center text-sm text-gray">Nenhum produto encontrado.</p>
                )}

                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 w-full mt-4 flex-1 overflow-y-auto pb-20">
                        {results.map((product) => (
                            <ProductSearchCard
                                key={product.Idproduto}
                                id={product.Idproduto}
                                productName={product.Descricao}
                                price={`R$ ${parseFloat(product.VLR_VENDA1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                imageUrl={getRandomMockImage()}
                                imageAlt={product.Descricao}
                            />
                        ))}
                    </div>
                )}
            </div>
            <NavBar />
        </>
    )
}

export default SearchPage
