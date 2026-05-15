const AdminSelect = ({ className = "", children, ...props }) => {
    return (
        <select
            {...props}
            className={`w-full rounded-lg border border-gray/20 bg-full-white px-4 py-3 text-deep-blue outline-none focus:border-orange ${className}`}
        >
            {children}
        </select>
    )
}

export default AdminSelect
