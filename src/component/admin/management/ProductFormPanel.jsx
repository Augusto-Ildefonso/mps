import AdminInput from "../forms/AdminInput"
import AdminSelect from "../forms/AdminSelect"
import AdminTextarea from "../forms/AdminTextarea"

const ProductFormPanel = ({
    title,
    description,
    formTopSlot,
    formData,
    onChange,
    categoryOptions,
    imageDraft,
    onImageDraftChange,
    onAddImage,
    images,
    onRemoveImage,
    imageFile,
    onImageFileChange,
    carOptions,
    selectedCar,
    onSelectedCarChange,
    onAddCar,
    cars,
    onRemoveCar,
    onSubmit,
    submitLabel,
    secondaryAction,
}) => {
    const hasCategories = categoryOptions.length > 0
    const hasCarOptions = carOptions.length > 0

    return (
        <section className="rounded-xl bg-full-white p-6 shadow-sm">
            <div className="mb-5 border-b border-gray/10 pb-4">
                <h2 className="text-lg font-bold text-deep-blue">{title}</h2>
                <p className="mt-1 text-sm text-gray">{description}</p>
            </div>

            {formTopSlot ? <div className="mb-4">{formTopSlot}</div> : null}

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <AdminInput
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Nome do acessório"
                    />
                    <AdminInput
                        name="sku"
                        value={formData.sku}
                        onChange={onChange}
                        placeholder="SKU"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <AdminInput
                        name="brand"
                        value={formData.brand}
                        onChange={onChange}
                        placeholder="Marca"
                    />
                    <AdminInput
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={onChange}
                        placeholder="Empresa / fabricante"
                    />
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <AdminSelect name="category" value={formData.category} onChange={onChange}>
                        <option value="">
                            {hasCategories ? "Selecione uma categoria" : "Sem categorias cadastradas"}
                        </option>
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </AdminSelect>
                    {!hasCategories ? (
                        <p className="text-xs text-gray">Sem categorias ainda. Cadastre no painel Geral.</p>
                    ) : null}
                </div>

                <AdminTextarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Descrição curta do acessório"
                    rows={4}
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <AdminInput
                        name="retailPrice"
                        type="number"
                        value={formData.retailPrice}
                        onChange={onChange}
                        placeholder="Preço varejo"
                    />
                    <AdminInput
                        name="wholesalePrice"
                        type="number"
                        value={formData.wholesalePrice}
                        onChange={onChange}
                        placeholder="Preço atacado"
                    />
                    <AdminInput
                        name="promoPrice"
                        type="number"
                        value={formData.promoPrice}
                        onChange={onChange}
                        placeholder="Preço promocional"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <AdminInput
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={onChange}
                        placeholder="Estoque"
                    />
                    <AdminInput
                        name="unidade"
                        value={formData.unidade ?? ""}
                        onChange={onChange}
                        placeholder="Unidade (PC, PAR, KT...)"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-deep-blue">Imagem do produto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageFileChange}
                        className="text-sm text-dark-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-light-gray file:text-deep-blue hover:file:bg-gray/20"
                    />
                    {imageFile && (
                        <div className="mt-2 flex items-center gap-3">
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-16 w-16 rounded-md object-cover" />
                            <p className="text-xs text-gray">{imageFile.name}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onAddImage}
                        className="rounded-lg border border-deep-blue px-4 py-3 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                    >
                        Adicionar imagem
                    </button>
                </div>

                <div className="rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-deep-blue">Imagens do item</p>
                        <span className="text-xs text-gray">{images.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {images.length === 0 ? (
                            <span className="text-sm text-gray">Sem imagens ainda.</span>
                        ) : (
                            images.map((imageUrl) => (
                                <button
                                    key={imageUrl}
                                    type="button"
                                    onClick={() => onRemoveImage(imageUrl)}
                                    className="rounded-full bg-full-white px-3 py-1 text-xs font-medium text-deep-blue shadow-sm transition hover:bg-red/10 hover:text-red"
                                >
                                    Remover imagem
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <AdminSelect
                        value={selectedCar}
                        onChange={(event) => onSelectedCarChange(event.target.value)}
                    >
                        <option value="">
                            {hasCarOptions ? "Selecione um carro compatível" : "Sem carros cadastrados"}
                        </option>
                        {carOptions.map((car) => (
                            <option key={car} value={car}>
                                {car}
                            </option>
                        ))}
                    </AdminSelect>
                    {!hasCarOptions ? (
                        <p className="text-xs text-gray">Sem carros ainda. Cadastre no painel Geral.</p>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onAddCar}
                        className="rounded-lg border border-deep-blue px-4 py-3 text-sm font-semibold text-deep-blue transition hover:bg-light-gray"
                    >
                        Adicionar carro
                    </button>
                </div>

                <div className="rounded-xl border border-gray/10 bg-light-gray/20 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-deep-blue">Carros no item</p>
                        <span className="text-xs text-gray">{cars.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {cars.length === 0 ? (
                            <span className="text-sm text-gray">Sem compatibilidades ainda.</span>
                        ) : (
                            cars.map((car) => (
                                <button
                                    key={car}
                                    type="button"
                                    onClick={() => onRemoveCar(car)}
                                    className="rounded-full bg-full-white px-3 py-1 text-xs font-medium text-deep-blue shadow-sm transition hover:bg-red/10 hover:text-red"
                                >
                                    {car}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="flex-1 rounded-lg bg-orange px-4 py-3 font-semibold text-full-white transition hover:opacity-90">
                        {submitLabel}
                    </button>
                    {secondaryAction ? (
                        <button
                            type="button"
                            onClick={secondaryAction.onClick}
                            className="rounded-lg border border-deep-blue px-4 py-3 font-semibold text-deep-blue transition hover:bg-light-gray"
                        >
                            {secondaryAction.label}
                        </button>
                    ) : null}
                </div>
            </form>
        </section>
    )
}

export default ProductFormPanel
