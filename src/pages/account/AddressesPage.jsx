import AddressCard from "../../component/Address/AddressCard";
import { LuPlus } from "react-icons/lu";
import Header from "../../component/Header/Header";
import { mockAddress } from "../../mock";
import NavBar from "../../component/NavBar/NavBar";
import  Button  from "../../component/GeneralButton/Button";
import { useNavigate } from "react-router-dom";
const AddressPage = ({addresses}) => {
    const navigate = useNavigate();
    const handleNavigation = (path) => {
        const routes = {
            "new": "/account/addresses/new"
        };
        navigate(routes[path] || "/account/addresses");
    }
    return (
        <div className="address-page p-3">
            <Header showBackButton={true} />
            <h1 className="text-xl font-bold text-center text-deep-blue mb-3 ">Meus Endereços</h1>
            <div className="flex flex-col gap-4">
            {mockAddress.map((address, _) => (
                <AddressCard address={address} />
            ))}
            </div>
            <Button text="Adicionar Novo Endereço" bg_color="bg-orange" handleNavigation={() => {handleNavigation("new")}} icon={<LuPlus className="text-2xl" />} />
            <NavBar />
        </div>
    )
}
export default AddressPage;