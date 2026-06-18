import { useState } from "react"
import { LuSearch } from "react-icons/lu"

/**
 * Search input component.
 * @param {{ onSearch?: (query: string) => void }} props
 */
const SearchBar = ({ onSearch }) => {
    const [text, setText] = useState("")

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur()
            if (onSearch) onSearch(text.trim())
        }
    }

    return (
        <div className="relative w-full mt-3">
            <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full h-12 md:h-14 p-4 pl-12 md:pl-14 bg-light-gray text-dark-gray border-2 border-dark-gray rounded-3xl focus:border-deep-blue focus:ring-2 focus:ring-deep-blue/20 outline-none transition-all duration-300 text-base md:text-md shadow-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <LuSearch className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-xl md:text-2xl stroke-dark-gray pointer-events-none" />
        </div>
    )
}

export default SearchBar
