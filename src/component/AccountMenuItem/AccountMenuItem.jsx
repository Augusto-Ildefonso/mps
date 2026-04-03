import { LuChevronRight } from "react-icons/lu"

const AccountMenuItem = ({ icon: Icon, label, description, onClick, showArrow = true }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex flex-row items-center justify-between p-4 bg-full-white rounded-xl shadow active:scale-[0.98] transition duration-300"
        >
            <div className="flex flex-row items-center gap-3">
                <Icon className="text-2xl stroke-deep-blue" />
                <div className="flex flex-col items-start">
                    <p className="font-bold text-deep-blue">{label}</p>
                    {description && <p className="text-sm text-gray">{description}</p>}
                </div>
            </div>
            {showArrow && <LuChevronRight className="text-xl stroke-gray" />}
        </button>
    )
}

export default AccountMenuItem
