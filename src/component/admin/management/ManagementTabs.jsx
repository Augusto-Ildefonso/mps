const tabs = [
    { id: "create", label: "Criar produto" },
    { id: "edit", label: "Editar produto" },
    { id: "general", label: "Geral" },
]

const ManagementTabs = ({ activeTab, onChange }) => {
    return (
        <div className="mt-4 flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const baseClass = "rounded-md px-4 py-2 text-sm font-semibold"
                const activeClass = "bg-deep-blue text-full-white"
                const inactiveClass = "border border-gray/20 text-deep-blue"

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}

export default ManagementTabs
