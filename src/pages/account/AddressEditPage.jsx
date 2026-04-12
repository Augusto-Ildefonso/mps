import AddressPage from "./Address";
import NavBar from "../../component/NavBar/NavBar";
const AddressEditPage = () => {
    return (
        <div className="grid grid-rows-[auto_1fr] min-h-screen w-auto p-2 gap-4 pb-20">
            <AddressPage title="Editar Endereço" />
            <NavBar />
        </div>
    )
}

export default AddressEditPage;