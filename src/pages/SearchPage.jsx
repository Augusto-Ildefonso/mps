import { useRef} from "react"
import NavBar from "../component/NavBar/NavBar"
import ProductSearchCard from "../component/ProductSearchCard/ProductSearchCard"
import SearchBar from "../component/SearchBar/SearchBar"
import {mockReq} from "../mock"
import Header from "../component/Header/Header"
import BannerNav from "../component/NavBar/BannerNav"

const SearchPage = () => {
    const lastScrollTopRef = useRef(0)
    const SCROLL_THRESHOLD = 12

    const handleListScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        const currentScrollTop = Math.max(0, scrollTop)
        const maxScrollTop = Math.max(0, scrollHeight - clientHeight)
        const isAtTop = currentScrollTop <= 0
        const isAtBottom = currentScrollTop >= maxScrollTop - 1
        const delta = currentScrollTop - lastScrollTopRef.current

        if (isAtTop) {
            setIsNavVisible(true)
            lastScrollTopRef.current = currentScrollTop
            return
        }

        if (isAtBottom) {
            setIsNavVisible(false)
            lastScrollTopRef.current = currentScrollTop
            return
        }

        if (delta > SCROLL_THRESHOLD) {
            setIsNavVisible(false)
        } else if (delta < -SCROLL_THRESHOLD) {
            setIsNavVisible(true)
        }

        lastScrollTopRef.current = currentScrollTop
    }

    return(
        <>
            <div className="p-5 h-[100dvh] flex flex-col overflow-hidden w-full">
                <Header />
                <BannerNav />
                <SearchBar/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 w-full mt-4 flex-1 overflow-y-auto pb-20" onScroll={handleListScroll}>
                    {
                        mockReq.map(element => (
                            <ProductSearchCard
                                key={element.id}
                                id={element.id}
                                productName={element.name}
                                price={`R$ ${element.price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                imageUrl={element.url}
                                imageAlt={element.alt}
                            />
                        ))
                    }
                </div>

            </div>
            <NavBar/>
        </>
    )
}

export default SearchPage