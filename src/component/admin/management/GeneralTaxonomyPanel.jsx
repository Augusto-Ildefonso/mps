import AdminInput from "../forms/AdminInput"

const GeneralTaxonomyPanel = ({
    categories,
    cars,
    newCategoryDraft,
    onCategoryDraftChange,
    onAddCategory,
    newCarDraft,
    onCarDraftChange,
    onAddCar,
}) => {
    return (
        <section className="rounded-xl bg-full-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray/10 pb-4">
                <h2 className="text-lg font-bold text-deep-blue">Categorias e fitment</h2>
                <p className="mt-1 text-sm text-gray">Cadastre opções controladas antes de usar nos formulários.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                    <p className="text-sm font-semibold text-deep-blue">Categorias disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.length === 0 ? (
                            <span className="text-sm text-gray">Nenhuma categoria ainda.</span>
                        ) : (
                            categories.map((category) => (
                                <span key={category} className="rounded-full bg-full-white px-3 py-1 text-xs font-medium text-deep-blue shadow-sm">
                                    {category}
                                </span>
                            ))
                        )}
                    </div>
                    <div className="flex gap-2">
                        <AdminInput
                            value={newCategoryDraft}
                            onChange={onCategoryDraftChange}
                            placeholder="Nova categoria"
                        />
                        <button
                            type="button"
                            onClick={onAddCategory}
                            className="rounded-lg border border-deep-blue px-4 py-3 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>

                <div className="space-y-3 rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                    <p className="text-sm font-semibold text-deep-blue">Carros compatíveis disponíveis</p>
                    <div className="flex flex-wrap gap-2">
                        {cars.length === 0 ? (
                            <span className="text-sm text-gray">Nenhum carro ainda.</span>
                        ) : (
                            cars.map((car) => (
                                <span key={car} className="rounded-full bg-full-white px-3 py-1 text-xs font-medium text-deep-blue shadow-sm">
                                    {car}
                                </span>
                            ))
                        )}
                    </div>
                    <div className="flex gap-2">
                        <AdminInput value={newCarDraft} onChange={onCarDraftChange} placeholder="Novo carro" />
                        <button
                            type="button"
                            onClick={onAddCar}
                            className="rounded-lg border border-deep-blue px-4 py-3 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GeneralTaxonomyPanel
