const DropDown = ({ options, value, onChange, ...props }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            {...props}
            className="h-12 w-full rounded-md border border-gray bg-white px-4 text-md text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default DropDown