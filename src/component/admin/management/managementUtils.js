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
})

export const getUniqueValues = (items, mapper) => {
    return Array.from(new Set(items.map(mapper).filter(Boolean)))
}

export const mergeUniqueValues = (currentValues, nextValues) => {
    return Array.from(new Set([...currentValues, ...nextValues].filter(Boolean)))
}

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
    images: images.length > 0 ? images : ["https://via.placeholder.com/320x240"],
    compatibleCars,
    description: formData.description,
})
