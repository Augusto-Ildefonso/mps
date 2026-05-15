import { useState } from "react"
import { LuMenu, LuX } from "react-icons/lu"
import Header from "../Header/Header"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children, activeSection, onSectionChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const closeMenu = () => setIsMenuOpen(false)

    return (
        <div className="min-h-screen flex flex-col bg-light-gray/40">
            <Header showBackButton={true} />

            <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4">
                <div className="mx-auto flex max-w-7xl flex-col gap-4">
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray/10 bg-full-white px-4 py-3 shadow-sm lg:hidden">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray">Admin panel</p>
                            <h1 className="text-lg font-extrabold text-deep-blue">Painel administrativo</h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((current) => !current)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray/15 px-4 py-2 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                            aria-expanded={isMenuOpen}
                            aria-label="Abrir menu administrativo"
                        >
                            {isMenuOpen ? <LuX size={18} /> : <LuMenu size={18} />}
                            Menu
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                        <div className="hidden lg:block">
                            <AdminSidebar
                                activeSection={activeSection}
                                onSectionChange={(section) => {
                                    onSectionChange(section)
                                    closeMenu()
                                }}
                            />
                        </div>

                        <div className="min-w-0">{children}</div>
                    </div>
                </div>
            </main>

            {isMenuOpen ? (
                <div className="fixed inset-0 z-40 bg-deep-blue/30 p-3 md:hidden" onClick={closeMenu}>
                    <div className="absolute left-3 right-3 top-3 rounded-2xl bg-full-white p-3 shadow-xl" onClick={(event) => event.stopPropagation()}>
                        <AdminSidebar
                            activeSection={activeSection}
                            onSectionChange={(section) => {
                                onSectionChange(section)
                                closeMenu()
                            }}
                            onClose={closeMenu}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default AdminLayout
