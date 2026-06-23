import { useState, useEffect } from "react"
import AddressCard from "../../component/Address/AddressCard"
import { LuPlus } from "react-icons/lu"
import Header from "../../component/Header/Header"
import { listAddresses } from "../../services/api/users"
import NavBar from "../../component/NavBar/NavBar"
import  Button  from "../../component/GeneralButton/Button"
import { useNavigate } from "react-router-dom"

const AddressPage = () => {
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
        <div className="address-page p-3">
            <Header showBackButton={true} />
            <h1 className="text-xl font-bold text-center text-deep-blue mb-3 ">Meus Endereços</h1>
            <div className="flex flex-col gap-4">
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
            <Button text="Adicionar Novo Endereço" bg_color="bg-orange" handleNavigation={() => navigate("/account/addresses/new")} icon={<LuPlus className="text-2xl" />} />
            <NavBar />
        </div>
    )
}

export default AddressPage
