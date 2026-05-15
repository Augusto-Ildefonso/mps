const AdminPageHeader = ({ title, description }) => {
    return (
        <div className="rounded-xl bg-full-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-extrabold text-deep-blue">{title}</h1>
            <p className="text-gray">{description}</p>
        </div>
    )
}

export default AdminPageHeader
