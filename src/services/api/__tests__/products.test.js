// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { produtosClient } from '../axiosClients.js'
import {
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  listProductImages,
  deleteProductImage,
  getProductImageUrl,
} from '../products.js'

const mockProduct = {
  Idproduto: 108,
  Descricao: 'ALTO FALANTE 6" TRIAK',
  Marca: 'Hurricane',
  Num_fab: 'F01.201',
  idunidade: 'PAR',
  VLR_VENDA1: 67.9,
  descricao: 'Descrição do produto',
  estoque: 255,
}

let mock

beforeEach(() => {
  mock = new MockAdapter(produtosClient)
})

afterEach(() => {
  mock.restore()
})

describe('getProductImageUrl', () => {
  it('builds a full static URL from a filename', () => {
    const url = getProductImageUrl('abc-123.jpg')
    expect(url).toBe('http://localhost:3000/static/abc-123.jpg')
  })
})

describe('searchProducts', () => {
  it('returns the products array from the response', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [mockProduct] }, message: null })

    const result = await searchProducts('hurricane')
    expect(result).toHaveLength(1)
    expect(result[0].Idproduto).toBe(108)
  })

  it('sends q param', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [] }, message: null })

    await searchProducts('test')
    expect(mock.history.get[0].params.q).toBe('test')
  })

  it('sends limit param when provided', async () => {
    mock
      .onGet('/api/products/search')
      .reply(200, { status: 'ok', data: { products: [] }, message: null })

    await searchProducts('test', 10)
    expect(mock.history.get[0].params.limit).toBe(10)
  })

  it('throws normalized error on failure', async () => {
    mock.onGet('/api/products/search').reply(500, { status: 'error', message: 'DB error' })

    await expect(searchProducts('x')).rejects.toMatchObject({
      message: 'DB error',
      status: 500,
    })
  })
})

describe('getProduct', () => {
  it('returns the product object', async () => {
    mock
      .onGet('/api/products/108')
      .reply(200, { status: 'ok', data: { product: mockProduct }, message: null })

    const result = await getProduct(108)
    expect(result.Idproduto).toBe(108)
  })

  it('throws 404 error when product not found', async () => {
    mock
      .onGet('/api/products/999')
      .reply(404, { status: 'error', message: 'Product with ID 999 not found' })

    await expect(getProduct(999)).rejects.toMatchObject({ status: 404 })
  })
})

describe('createProduct', () => {
  it('posts to /api/products and returns the created product', async () => {
    const payload = { nome: 'Test', marca: 'Brand', unidade: 'PC', valor: 99.9, estoque: 10 }
    mock
      .onPost('/api/products')
      .reply(200, { status: 'ok', data: { product: mockProduct }, message: null })

    const result = await createProduct(payload)
    expect(result.Idproduto).toBe(108)
    expect(JSON.parse(mock.history.post[0].data)).toMatchObject(payload)
  })
})

describe('updateProduct', () => {
  it('patches the product and returns the updated product', async () => {
    mock
      .onPatch('/api/products/108')
      .reply(200, { status: 'ok', data: { product: { ...mockProduct, Descricao: 'Updated' } }, message: null })

    const result = await updateProduct(108, { nome: 'Updated' })
    expect(result.Descricao).toBe('Updated')
  })
})

describe('deleteProduct', () => {
  it('sends DELETE request and returns deleted product', async () => {
    mock
      .onDelete('/api/products/108')
      .reply(200, { status: 'success', data: { product: mockProduct }, message: null })

    const result = await deleteProduct(108)
    expect(result.Idproduto).toBe(108)
  })
})

describe('uploadProductImage', () => {
  it('posts multipart to the imagens endpoint and returns the image', async () => {
    const mockImage = { id: 1, id_produto: 108, path: 'abc.jpg', created_at: '2026-01-01' }
    mock
      .onPost('/api/products/108/imagens')
      .reply(200, { status: 'ok', data: { image: mockImage }, message: null })

    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    const result = await uploadProductImage(108, file)

    expect(result.id).toBe(1)
    expect(mock.history.post[0].url).toBe('/api/products/108/imagens')
    const body = mock.history.post[0].data
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('file')).toBeInstanceOf(File)
  })
})

describe('listProductImages', () => {
  it('returns images array', async () => {
    const mockImages = [{ id: 1, id_produto: 108, path: 'abc.jpg', created_at: '2026-01-01' }]
    mock
      .onGet('/api/products/108/imagens')
      .reply(200, { status: 'ok', data: { images: mockImages }, message: null })

    const result = await listProductImages(108)
    expect(result).toHaveLength(1)
    expect(result[0].path).toBe('abc.jpg')
  })
})

describe('deleteProductImage', () => {
  it('sends DELETE to the image endpoint', async () => {
    const mockImage = { id: 1, id_produto: 108, path: 'abc.jpg', created_at: '2026-01-01' }
    mock
      .onDelete('/api/products/108/imagens/1')
      .reply(200, { status: 'success', data: { image: mockImage }, message: null })

    const result = await deleteProductImage(108, 1)
    expect(result.id).toBe(1)
  })
})
