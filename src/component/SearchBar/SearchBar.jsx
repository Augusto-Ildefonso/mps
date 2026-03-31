import { useState } from "react"

const SearchBar = () => {
    const [text, setText] = useState("")

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            // Lógica de mandar para o servidor
            e.target.blur()
        }
    }

    return(
        <input 
            type="text" 
            placeholder="Buscar"
            className="w-full h-10 p-2 bg-light-gray text-dark-gray border-2 border-dark-gray rounded-3xl"
            onChange={(e) => {setText(e.target.value.toLowerCase())}}
            onKeyDown={handleKeyDown}
        />
    )
}

export default SearchBar;