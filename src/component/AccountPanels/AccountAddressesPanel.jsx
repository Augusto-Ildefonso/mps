import { useState, useEffect } from "react"
import AddressCard from "../../component/Address/AddressCard"
import { LuPlus } from "react-icons/lu"
import { listAddresses } from "../../services/api/users"
import { useNavigate } from "react-router-dom"

const AccountAddressesPanel = () => {
    const navigate = useNavigate()
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        listAddresses()
            .then(setAddresses)
            .catch(() => setAddresses([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-xl font-extrabold text-deep-blue">Meus Endereços</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg font-bold hover:bg-orange/90 transition active:scale-95" onClick={() => navigate("/account/addresses/new")}>
                        <LuPlus className="text-xl" />
                        <span className="text-sm">Novo Endereço</span>
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {loading ? (
                        <p className="text-sm text-gray text-center py-4">Carregando...</p>
                    ) : addresses.length === 0 ? (
                        <p className="text-sm text-gray text-center py-4">Nenhum endereço cadastrado.</p>
                    ) : (
                        addresses.map((address, index) => (
                            <AddressCard key={address.id ?? index} address={address} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountAddressesPanel
