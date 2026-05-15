import { useMemo, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminSelect from "../../component/admin/forms/AdminSelect"
import GeneralTaxonomyPanel from "../../component/admin/management/GeneralTaxonomyPanel"
import ManagementTabs from "../../component/admin/management/ManagementTabs"
import ProductCatalogPanel from "../../component/admin/management/ProductCatalogPanel"
import ProductFormPanel from "../../component/admin/management/ProductFormPanel"
import {
    buildProductPayload,
    createEmptyProductForm,
    getUniqueValues,
    mergeUniqueValues,
} from "../../component/admin/management/managementUtils"
import { mockProducts } from "../../mock/adminMock"

const AdminManagement = () => {
    const [activeSection, setActiveSection] = useState("management")
    const [activeTab, setActiveTab] = useState("create")
    const [products, setProducts] = useState(mockProducts)
    const [categoryOptions, setCategoryOptions] = useState(() => getUniqueValues(mockProducts, (product) => product.category))
    const [carOptions, setCarOptions] = useState(() =>
        getUniqueValues(mockProducts.flatMap((product) => product.compatibleCars || []), (value) => value),
    )
    const [createForm, setCreateForm] = useState(createEmptyProductForm())
    const [editForm, setEditForm] = useState(createEmptyProductForm())
    const [selectedProductId, setSelectedProductId] = useState(mockProducts[0]?.id ?? null)
    const [createImageDraft, setCreateImageDraft] = useState("")
    const [createImages, setCreateImages] = useState([])
    const [createCars, setCreateCars] = useState([])
    const [editImageDraft, setEditImageDraft] = useState("")
    const [editImages, setEditImages] = useState(products[0]?.images ?? [])
    const [editCars, setEditCars] = useState(products[0]?.compatibleCars ?? [])
    const [newCategoryDraft, setNewCategoryDraft] = useState("")
    const [newCarDraft, setNewCarDraft] = useState("")
    const [selectedCreateCar, setSelectedCreateCar] = useState("")
    const [selectedEditCar, setSelectedEditCar] = useState("")

    const totalStockValue = useMemo(() => {
        return products.reduce((sum, product) => sum + product.price * product.quantity, 0)
    }, [products])

    const selectedProduct = useMemo(() => {
        return products.find((product) => product.id === selectedProductId) ?? null
    }, [products, selectedProductId])

    const updateSelectedProductForm = (product) => {
        if (!product) {
            return
        }

        setSelectedProductId(product.id)
        setEditForm({
            name: product.name,
            sku: product.sku,
            brand: product.brand ?? "",
            manufacturer: product.manufacturer ?? "",
            retailPrice: String(product.price ?? ""),
            wholesalePrice: String(product.wholesalePrice ?? ""),
            promoPrice: String(product.promoPrice ?? ""),
            quantity: String(product.quantity ?? ""),
            category: product.category ?? "",
            description: product.description ?? "",
        })
        setEditImages([...(product.images ?? [])])
        setEditCars([...(product.compatibleCars ?? [])])
        setSelectedEditCar("")
    }

    const addUniqueItem = (value, setter) => {
        const nextValue = value.trim()

        if (!nextValue) {
            return
        }

        setter((current) => (current.includes(nextValue) ? current : [...current, nextValue]))
    }

    const removeItem = (value, setter) => {
        setter((current) => current.filter((item) => item !== value))
    }

    const handleCreateChange = (event) => {
        const { name, value } = event.target

        setCreateForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    const handleEditChange = (event) => {
        const { name, value } = event.target

        setEditForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    const handleCreateSubmit = (event) => {
        event.preventDefault()

        const nextProduct = buildProductPayload(createForm, createImages, createCars)

        setProducts((current) => [nextProduct, ...current])
        setCategoryOptions((current) => mergeUniqueValues(current, [nextProduct.category]))
        setCarOptions((current) => mergeUniqueValues(current, nextProduct.compatibleCars))
        setCreateForm(createEmptyProductForm())
        setCreateImageDraft("")
        setCreateImages([])
        setCreateCars([])
        setSelectedCreateCar("")
        setSelectedProductId(nextProduct.id)
    }

    const handleEditSubmit = (event) => {
        event.preventDefault()

        if (!selectedProduct) {
            return
        }

        const updatedProduct = buildProductPayload(editForm, editImages, editCars, selectedProduct.id)

        setProducts((current) => current.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)))
        setCategoryOptions((current) => mergeUniqueValues(current, [updatedProduct.category]))
        setCarOptions((current) => mergeUniqueValues(current, updatedProduct.compatibleCars))
        setSelectedProductId(updatedProduct.id)
    }

    const handleDelete = (productId) => {
        setProducts((current) => {
            const nextProducts = current.filter((product) => product.id !== productId)

            if (selectedProductId === productId) {
                const nextProduct = nextProducts[0] ?? null

                if (nextProduct) {
                    updateSelectedProductForm(nextProduct)
                } else {
                    setSelectedProductId(null)
                    setEditForm(createEmptyProductForm())
                    setEditImages([])
                    setEditCars([])
                }
            }

            return nextProducts
        })
    }

    const addCategoryOption = () => {
        const nextCategory = newCategoryDraft.trim()

        if (!nextCategory) {
            setNewCategoryDraft("")
            return
        }

        setCategoryOptions((current) => mergeUniqueValues(current, [nextCategory]))
        if (!createForm.category) {
            setCreateForm((current) => ({ ...current, category: nextCategory }))
        }
        if (!editForm.category) {
            setEditForm((current) => ({ ...current, category: nextCategory }))
        }
        setNewCategoryDraft("")
    }

    const addCarOption = () => {
        const nextCar = newCarDraft.trim()

        if (!nextCar) {
            setNewCarDraft("")
            return
        }

        setCarOptions((current) => mergeUniqueValues(current, [nextCar]))
        setNewCarDraft("")
    }

    const handleCatalogEdit = (product) => {
        updateSelectedProductForm(product)
        setActiveTab("edit")
    }

    const editSelector = (
        <AdminSelect
            value={selectedProductId ?? ""}
            onChange={(event) =>
                updateSelectedProductForm(products.find((product) => product.id === Number(event.target.value)) ?? null)
            }
            disabled={products.length === 0}
        >
            {products.length === 0 ? (
                <option value="">Sem produtos cadastrados</option>
            ) : (
                products.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                    </option>
                ))
            )}
        </AdminSelect>
    )

    return (
        <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Gerenciar produtos"
                    description="Crie acessórios automotivos em um painel e edite itens existentes em outro, sem apertar tudo na mesma área."
                />

                <ManagementTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="space-y-6">
                    {activeTab === "create" && (
                        <ProductFormPanel
                            title="Novo acessório"
                            description="Cadastro guiado com listas para categoria, imagens e fitment."
                            formData={createForm}
                            onChange={handleCreateChange}
                            categoryOptions={categoryOptions}
                            imageDraft={createImageDraft}
                            onImageDraftChange={(event) => setCreateImageDraft(event.target.value)}
                            onAddImage={() => {
                                addUniqueItem(createImageDraft, setCreateImages)
                                setCreateImageDraft("")
                            }}
                            images={createImages}
                            onRemoveImage={(imageUrl) => removeItem(imageUrl, setCreateImages)}
                            carOptions={carOptions}
                            selectedCar={selectedCreateCar}
                            onSelectedCarChange={setSelectedCreateCar}
                            onAddCar={() => {
                                addUniqueItem(selectedCreateCar, setCreateCars)
                                setSelectedCreateCar("")
                            }}
                            cars={createCars}
                            onRemoveCar={(car) => removeItem(car, setCreateCars)}
                            onSubmit={handleCreateSubmit}
                            submitLabel="Adicionar acessório"
                        />
                    )}

                    {activeTab === "edit" && (
                        <ProductFormPanel
                            title="Editar acessório existente"
                            description="Escolha um item e edite ele em um painel separado."
                            formTopSlot={editSelector}
                            formData={editForm}
                            onChange={handleEditChange}
                            categoryOptions={categoryOptions}
                            imageDraft={editImageDraft}
                            onImageDraftChange={(event) => setEditImageDraft(event.target.value)}
                            onAddImage={() => {
                                addUniqueItem(editImageDraft, setEditImages)
                                setEditImageDraft("")
                            }}
                            images={editImages}
                            onRemoveImage={(imageUrl) => removeItem(imageUrl, setEditImages)}
                            carOptions={carOptions}
                            selectedCar={selectedEditCar}
                            onSelectedCarChange={setSelectedEditCar}
                            onAddCar={() => {
                                addUniqueItem(selectedEditCar, setEditCars)
                                setSelectedEditCar("")
                            }}
                            cars={editCars}
                            onRemoveCar={(car) => removeItem(car, setEditCars)}
                            onSubmit={handleEditSubmit}
                            submitLabel="Salvar alterações"
                            secondaryAction={{
                                label: "Reverter",
                                onClick: () => updateSelectedProductForm(selectedProduct),
                            }}
                        />
                    )}

                    {activeTab === "general" && (
                        <GeneralTaxonomyPanel
                            categories={categoryOptions}
                            cars={carOptions}
                            newCategoryDraft={newCategoryDraft}
                            onCategoryDraftChange={(event) => setNewCategoryDraft(event.target.value)}
                            onAddCategory={addCategoryOption}
                            newCarDraft={newCarDraft}
                            onCarDraftChange={(event) => setNewCarDraft(event.target.value)}
                            onAddCar={addCarOption}
                        />
                    )}
                </div>

                <ProductCatalogPanel
                    products={products}
                    totalStockValue={totalStockValue}
                    onEdit={handleCatalogEdit}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    )
}

export default AdminManagement
