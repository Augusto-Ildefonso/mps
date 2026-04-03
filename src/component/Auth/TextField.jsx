const TextField = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1 block text-bg font-medium text-slate-700 ">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-md border border-gray bg-white px-4 text-md text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  )
}

export default TextField
