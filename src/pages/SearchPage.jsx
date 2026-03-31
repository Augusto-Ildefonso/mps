import { useRef, useState } from "react"
import motor from "../assets/motor.jpg"
import NavBar from "../component/NavBar/NavBar"
import ProductSearchCard from "../component/ProductSearchCard/ProductSearchCard"
import SearchBar from "../component/SearchBar/SearchBar"

const mockReq = [
    {
        "id": 1,
        "name": "Motor",
        "price": 2000.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 2,
        "name": "Motor",
        "price": 5000.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 3,
        "name": "Motor",
        "price": 100.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 4,
        "name": "Motor",
        "price": 404.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 5,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 6,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 7,
        "name": "Motor",
        "price": 599.99,
        "url": motor,
        "alt": "motor"
    },
    {
        "id": 8,
        "name": "Motor",
        "price": 10.0,
        "url": motor,
        "alt": "motor"
    },
]

const SearchPage = () => {
    const [isNavVisible, setIsNavVisible] = useState(true)
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
                <SearchBar/>
                <div className="flex flex-col gap-5 p-2 w-full mt-4 flex-1 overflow-y-auto pb-20" onScroll={handleListScroll}>
                    {
                        mockReq.map(element => (
                            <ProductSearchCard
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
            <NavBar isVisible={isNavVisible}/>
        </>
    )
}

export default SearchPage