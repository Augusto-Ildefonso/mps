import { useEffect } from "react"
import "./Alert.css"

const Alert = ({
    isVisible,
    message = "Adicionado ao carrinho!",
    duration = 3000,
    onClose,
    resetKey = 0,
}) => {
    useEffect(() => {
        if (!isVisible) {
            return undefined
        }

        const timeoutId = setTimeout(() => {
            onClose?.()
        }, duration)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [isVisible, duration, onClose, resetKey])

    if (!isVisible) {
        return null
    }

    return (
        <div className="fixed top-4 right-4 z-[1000] w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-light-gray bg-full-white shadow-lg alert-enter">
            <p className="px-4 py-3 text-sm font-semibold text-deep-blue">{message}</p>
            <div className="h-1 w-full overflow-hidden rounded-b-xl bg-light-gray">
                <div
                    key={resetKey}
                    className="h-full bg-dark-blue alert-progress"
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    )
}

export default Alert
