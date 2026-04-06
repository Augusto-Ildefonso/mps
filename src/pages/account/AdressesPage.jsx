import AddressCard from "../../component/Address/AdressCard";
import Header from "../../component/Header/Header";
import { mockAddress } from "../../mock";
import NavBar from "../../component/NavBar/NavBar";
const AddressPage = ({addresses}) => {

    return (
        <div className="address-page">
            <Header />
            <h1 className="text-xl font-bold text-center text-deep-blue mb-3">Meus Endereços</h1>
            <div className="flex flex-col gap-4">
            {mockAddress.map((address, _) => (
                <AddressCard address={address} />
            ))}
            </div>
            <NavBar />
        </div>
    )
}
export default AddressPage;