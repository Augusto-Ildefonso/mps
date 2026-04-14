import { LuCircle, LuMapPin } from "react-icons/lu"

const CheckoutAddressCard = ({ address, selected = false, onSelect }) => {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            className={`w-full rounded-xl border p-4 text-left transition duration-300 active:scale-[0.99] ${selected ? "border-orange bg-orange/5 shadow-[0_6px_18px_rgba(249,115,22,0.12)]" : "border-slate-200 bg-full-white shadow-[0_4px_10px_rgba(15,23,42,0.06)]"}`}
        >
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-orange text-full-white" : "bg-slate-100 text-deep-blue"}`}>
                    <LuMapPin className="text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-base font-bold text-deep-blue">{address.name}</h2>
                            <p className="mt-1 text-sm text-gray">{address.street}, {address.number}</p>
                        </div>
                        <div className="shrink-0 text-xl text-orange">
                            {selected ? (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-orange bg-orange/10">
                                    <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                                </span>
                            ) : (
                                <LuCircle />
                            )}
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray">{address.city} - {address.state}</p>
                    <p className="text-sm text-gray">CEP: {address.cep}</p>
                </div>
            </div>
        </button>
    )
}

export default CheckoutAddressCard
