import { Navigate } from "react-router-dom"

const ProtectAdminRoute = ({ children }) => {
    // Mock admin check: in production, this would check against a real authentication context or JWT
    const isAdmin = localStorage.getItem("adminRole") === "admin"

    if (!isAdmin) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectAdminRoute
