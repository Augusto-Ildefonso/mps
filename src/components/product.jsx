import { useState } from "react"

export default function Product({ name, price, image }) {
    const [imageError, setImageError] = useState(false)
    const showFallback = !image || imageError

    return (
        <div className="mx-auto h-[100px] w-[280px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm overflow-hidden">
            {showFallback ? (
                <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-500">
                    No image available
                </div>
            ) : (
                <img
                    className="mx-auto rounded-lg object-contain"
                    src={image}
                    alt={name}
                    onError={() => setImageError(true)}
                />
            )}
            <div className="mt-4 text-center">
                <p className="text-lg font-bold text-gray-900">{name}</p>
                <p className="mt-1 text-base text-gray-500">${price}</p>
            </div>
        </div>
    )
}