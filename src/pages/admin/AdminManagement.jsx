import { useCallback, useEffect, useMemo, useState } from "react"
import AdminLayout from "../../component/admin/AdminLayout"
import AdminPageHeader from "../../component/admin/AdminPageHeader"
import AdminSelect from "../../component/admin/forms/AdminSelect"
import GeneralTaxonomyPanel from "../../component/admin/management/GeneralTaxonomyPanel"
import ManagementTabs from "../../component/admin/management/ManagementTabs"
import ProductCatalogPanel from "../../component/admin/management/ProductCatalogPanel"
import ProductFormPanel from "../../component/admin/management/ProductFormPanel"
import {
    buildApiProductPayload,
    createEmptyProductForm,
    getUniqueValues,
    loadApiProductIntoForm,
    mergeUniqueValues,
} from "../../component/admin/management/managementUtils"
import {
    createProduct,
    deleteProduct,
    searchProducts,
    updateProduct,
    uploadProductImage,
} from "../../services/api/products"

const AdminManagement = () => {
    const [activeSection, setActiveSection] = useState("management")
    const [activeTab, setActiveTab] = useState("create")
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [apiError, setApiError] = useState(null)

    const [categoryOptions, setCategoryOptions] = useState([])
    const [carOptions, setCarOptions] = useState([])

    const [createForm, setCreateForm] = useState(createEmptyProductForm())
    const [createFile, setCreateFile] = useState(null)
    const [editForm, setEditForm] = useState(createEmptyProductForm())
    const [editFile, setEditFile] = useState(null)
    const [selectedProductId, setSelectedProductId] = useState(null)

    const [createCars, setCreateCars] = useState([])
    const [editCars, setEditCars] = useState([])
    const [selectedCreateCar, setSelectedCreateCar] = useState("")
    const [selectedEditCar, setSelectedEditCar] = useState("")
    const [newCategoryDraft, setNewCategoryDraft] = useState("")
    const [newCarDraft, setNewCarDraft] = useState("")

    const loadProducts = useCallback(async () => {
        setLoadingProducts(true)
        setApiError(null)
        try {
            const data = await searchProducts("")
            setProducts(data)
        } catch (err) {
            setApiError(err.message ?? "Erro ao carregar produtos.")
        } finally {
            setLoadingProducts(false)
        }
    }, [])

    useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const totalStockValue = useMemo(() => {
        return products.reduce(
            (sum, p) => sum + parseFloat(p.VLR_VENDA1) * p.estoque,
            0
        )
    }, [products])

    const selectedProduct = useMemo(
        () => products.find((p) => p.Idproduto === selectedProductId) ?? null,
        [products, selectedProductId]
    )

    const updateSelectedProductForm = (product) => {
        if (!product) return
        setSelectedProductId(product.Idproduto)
        setEditForm(loadApiProductIntoForm(product))
        setEditCars([])
        setSelectedEditCar("")
        setEditFile(null)
    }

    const addUniqueItem = (value, setter) => {
        const next = value.trim()
        if (!next) return
        setter((current) => (current.includes(next) ? current : [...current, next]))
    }

    const removeItem = (value, setter) => {
        setter((current) => current.filter((item) => item !== value))
    }

    const handleCreateChange = (event) => {
        const { name, value } = event.target
        setCreateForm((current) => ({ ...current, [name]: value }))
    }

    const handleEditChange = (event) => {
        const { name, value } = event.target
        setEditForm((current) => ({ ...current, [name]: value }))
    }

    const handleCreateSubmit = async (event) => {
        event.preventDefault()
        setApiError(null)
        try {
            const payload = buildApiProductPayload(createForm)
            const newProduct = await createProduct(payload)
            if (createFile) {
                await uploadProductImage(newProduct.Idproduto, createFile)
            }
            await loadProducts()
            setCreateForm(createEmptyProductForm())
            setCreateFile(null)
            setCreateCars([])
            setSelectedCreateCar("")
        } catch (err) {
            setApiError(err.message ?? "Erro ao criar produto.")
        }
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault()
        if (!selectedProduct) return
        setApiError(null)
        try {
            const payload = buildApiProductPayload(editForm)
            await updateProduct(selectedProduct.Idproduto, payload)
            if (editFile) {
                await uploadProductImage(selectedProduct.Idproduto, editFile)
            }
            await loadProducts()
            setEditFile(null)
        } catch (err) {
            setApiError(err.message ?? "Erro ao atualizar produto.")
        }
    }

    const handleDelete = async (productId) => {
        setApiError(null)
        try {
            await deleteProduct(productId)
            await loadProducts()
            if (selectedProductId === productId) {
                setSelectedProductId(null)
                setEditForm(createEmptyProductForm())
            }
        } catch (err) {
            setApiError(err.message ?? "Erro ao excluir produto.")
        }
    }

    const addCategoryOption = () => {
        const next = newCategoryDraft.trim()
        if (!next) { setNewCategoryDraft(""); return }
        setCategoryOptions((current) => mergeUniqueValues(current, [next]))
        setNewCategoryDraft("")
    }

    const addCarOption = () => {
        const next = newCarDraft.trim()
        if (!next) { setNewCarDraft(""); return }
        setCarOptions((current) => mergeUniqueValues(current, [next]))
        setNewCarDraft("")
    }

    const handleCatalogEdit = (product) => {
        updateSelectedProductForm(product)
        setActiveTab("edit")
    }

    const editSelector = (
        <AdminSelect
            value={selectedProductId ?? ""}
            onChange={(event) => {
                const p = products.find((p) => p.Idproduto === Number(event.target.value)) ?? null
                updateSelectedProductForm(p)
            }}
            disabled={products.length === 0}
        >
            {products.length === 0 ? (
                <option value="">Sem produtos cadastrados</option>
            ) : (
                products.map((product) => (
                    <option key={product.Idproduto} value={product.Idproduto}>
                        {product.Descricao} — {product.Marca}
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
                    description="Crie, edite e exclua produtos do catálogo."
                />

                {apiError && (
                    <div className="rounded-xl bg-red/10 border border-red px-4 py-3 text-sm text-red font-semibold">
                        {apiError}
                    </div>
                )}

                {loadingProducts && (
                    <p className="text-sm text-gray text-center">Carregando catálogo...</p>
                )}

                <ManagementTabs activeTab={activeTab} onChange={setActiveTab} />

                <div className="space-y-6">
                    {activeTab === "create" && (
                        <ProductFormPanel
                            title="Novo produto"
                            description="Preencha os campos e salve para criar o produto via API."
                            formData={createForm}
                            onChange={handleCreateChange}
                            categoryOptions={categoryOptions}
                            imageDraft=""
                            onImageDraftChange={() => {}}
                            onAddImage={() => {}}
                            images={[]}
                            onRemoveImage={() => {}}
                            imageFile={createFile}
                            onImageFileChange={(e) => setCreateFile(e.target.files[0] ?? null)}
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
                            submitLabel="Adicionar produto"
                        />
                    )}

                    {activeTab === "edit" && (
                        <ProductFormPanel
                            title="Editar produto existente"
                            description="Escolha um produto e edite seus dados."
                            formTopSlot={editSelector}
                            formData={editForm}
                            onChange={handleEditChange}
                            categoryOptions={categoryOptions}
                            imageDraft=""
                            onImageDraftChange={() => {}}
                            onAddImage={() => {}}
                            images={[]}
                            onRemoveImage={() => {}}
                            imageFile={editFile}
                            onImageFileChange={(e) => setEditFile(e.target.files[0] ?? null)}
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

                {!loadingProducts && (
                    <ProductCatalogPanel
                        products={products}
                        totalStockValue={totalStockValue}
                        onEdit={handleCatalogEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminManagement
