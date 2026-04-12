import { LuPencil } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuCirclePlus, LuCircleMinus } from "react-icons/lu";
import React from "react";
import { useNavigate } from "react-router-dom"
const AddressCard = ({ address }) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(true);
    return (
        <div className="address-card rounded-xl shadow-[0_-1px_4px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.06)] p-4 bg-full-white">
            <div className="grid grid-cols-3 gap-4 items-start">
                <div className="col-span-3 flex items-center gap-2 border-b pb-2">
                    <h2 className="flex-1 text-lg font-bold text-deep-blue">{address.name}</h2>
                    <button className="border-none ml-auto" type="button" title={expanded ? "Ver menos" : "Ver mais"} aria-label={expanded ? "Ver menos" : "Ver mais"} onClick={() => setExpanded(!expanded)} >
                        <div className={`transition-transform duration-600 ${expanded ? 'rotate-180' : 'rotate-90'}`}>
                            {expanded ? <LuCircleMinus className="text-2xl text-gray cursor-pointer ml-auto" /> : <LuCirclePlus className="text-2xl text-gray cursor-pointer ml-auto" />}
                        </div>
                    </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} col-span-2 flex flex-col items-start gap-1`}>
                    <p className="text-sm font-light text-gray">{address.street}, {address.number}</p>
                    <p className="text-sm font-light text-gray">{address.city} - {address.state}</p>
                    <p className="text-sm font-light text-gray">CEP: {address.cep}</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} ml-auto flex flex-col items-start gap-2`}>
                    <button className="rounded border-none ml-auto" type="button" title="Editar endereço" aria-label="Editar endereço" onClick={() => navigate("/account/addresses/edit", { state: { address } })}>
                        <LuPencil className="text-2xl text-deep-blue cursor-pointer ml-auto" />
                    </button>
                    <button className="border-none ml-2" type="button" title="Excluir endereço" aria-label="Excluir endereço">
                        <LuTrash2 className="text-2xl text-red cursor-pointer ml-auto" />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default AddressCard;