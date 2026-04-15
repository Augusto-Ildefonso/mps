import AddressCard from "../../component/Address/AddressCard"
import { LuPlus } from "react-icons/lu"
import { mockAddress } from "../../mock"
import { useNavigate } from "react-router-dom"

const AccountAddressesPanel = () => {
    const navigate = useNavigate()
    const handleNavigate = () => {
        navigate("/account/addresses/new")
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="bg-full-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-xl font-extrabold text-deep-blue">Meus Endereços</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-lg font-bold hover:bg-orange/90 transition active:scale-95" onClick={handleNavigate}>
                        <LuPlus className="text-xl" />
                        <span className="text-sm">Novo Endereço</span>
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {mockAddress.map((address, index) => (
                        <AddressCard key={index} address={address} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AccountAddressesPanel
