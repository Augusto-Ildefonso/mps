const AdminTextarea = ({ className = "", ...props }) => {
    return (
        <textarea
            {...props}
            className={`w-full rounded-lg border border-gray/20 bg-full-white px-4 py-3 text-deep-blue outline-none focus:border-orange ${className}`}
        />
    )
}

export default AdminTextarea
