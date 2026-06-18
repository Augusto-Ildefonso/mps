export const createEmptyProductForm = () => ({
    name: "",
    sku: "",
    brand: "",
    manufacturer: "",
    retailPrice: "",
    wholesalePrice: "",
    promoPrice: "",
    quantity: "",
    category: "",
    description: "",
    unidade: "PC",
})

export const getUniqueValues = (items, mapper) => {
    return Array.from(new Set(items.map(mapper).filter(Boolean)))
}

export const mergeUniqueValues = (currentValues, nextValues) => {
    return Array.from(new Set([...currentValues, ...nextValues].filter(Boolean)))
}

/** Build payload for the mock in-memory catalog (legacy — used by AdminManagement state). */
export const buildProductPayload = (formData, images, compatibleCars, productId) => ({
    id: productId ?? Date.now(),
    name: formData.name,
    sku: formData.sku,
    price: Number(formData.retailPrice),
    wholesalePrice: Number(formData.wholesalePrice),
    promoPrice: Number(formData.promoPrice),
    quantity: Number(formData.quantity),
    category: formData.category,
    brand: formData.brand,
    manufacturer: formData.manufacturer,
    images: images.length > 0 ? images : [],
    compatibleCars,
    description: formData.description,
})

/**
 * Build the request body for POST /api/products or PATCH /api/products/:id.
 * Maps form fields to the API's snake_case naming.
 */
export const buildApiProductPayload = (formData) => ({
    nome: formData.name,
    marca: formData.brand,
    num_fab: formData.sku || undefined,
    unidade: formData.unidade || "PC",
    valor: parseFloat(formData.retailPrice),
    descricao: formData.description || undefined,
    estoque: parseInt(formData.quantity, 10) || 0,
})

/**
 * Map an API Product object (legacy CSV field names) into the form data shape.
 */
export const loadApiProductIntoForm = (product) => ({
    name: product.Descricao,
    sku: product.Num_fab ?? "",
    brand: product.Marca,
    manufacturer: "",
    retailPrice: String(product.VLR_VENDA1),
    wholesalePrice: "",
    promoPrice: "",
    quantity: String(product.estoque),
    category: "",
    description: product.descricao ?? "",
    unidade: product.idunidade ?? "PC",
})
