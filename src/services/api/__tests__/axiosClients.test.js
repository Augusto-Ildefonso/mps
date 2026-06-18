// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import MockAdapter from 'axios-mock-adapter'

// Node.js 22+ defines globalThis.localStorage as undefined (experimental Web Storage).
// vitest's jsdom environment does not override it (not in the KEYS whitelist).
// Redirect the global to jsdom's real Storage instance so tests use the proper API.
vi.stubGlobal('localStorage', globalThis.jsdom.window.localStorage)

import { produtosClient, pedidosClient } from '../axiosClients.js'

describe('produtosClient', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(produtosClient)
  })

  afterEach(() => {
    mock.restore()
  })

  it('uses localhost:3000 as baseURL by default', () => {
    expect(produtosClient.defaults.baseURL).toBe('http://localhost:3000')
  })

  it('normalises error responses into Error with status and message', async () => {
    mock.onGet('/test').reply(404, { status: 'error', message: 'Not found' })

    let caught
    try {
      await produtosClient.get('/test')
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(Error)
    expect(caught.message).toBe('Not found')
    expect(caught.status).toBe(404)
    expect(caught.items).toBeNull()
  })

  it('attaches items array to error when present', async () => {
    mock.onGet('/test').reply(422, {
      status: 'error',
      message: 'Product validation failed',
      items: [{ id_product: 1, reason: 'not found' }],
    })

    let caught
    try {
      await produtosClient.get('/test')
    } catch (err) {
      caught = err
    }

    expect(caught.items).toHaveLength(1)
    expect(caught.items[0].id_product).toBe(1)
  })

  it('passes through successful responses unchanged', async () => {
    mock.onGet('/test').reply(200, { status: 'ok', data: { x: 1 }, message: null })
    const res = await produtosClient.get('/test')
    expect(res.data.data.x).toBe(1)
  })
})

describe('pedidosClient', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(pedidosClient)
    localStorage.clear()
  })

  afterEach(() => {
    mock.restore()
    localStorage.clear()
  })

  it('uses localhost:3001 as baseURL by default', () => {
    expect(pedidosClient.defaults.baseURL).toBe('http://localhost:3001')
  })

  it('attaches Authorization header from localStorage when token present', async () => {
    localStorage.setItem('authToken', 'test-jwt-token')
    mock.onGet('/test').reply(200, { status: 'ok', data: {}, message: null })

    await pedidosClient.get('/test')

    expect(mock.history.get[0].headers['Authorization']).toBe('Bearer test-jwt-token')
  })

  it('makes request without Authorization header when no token in localStorage', async () => {
    mock.onGet('/test').reply(200, { status: 'ok', data: {}, message: null })

    await pedidosClient.get('/test')

    expect(mock.history.get[0].headers['Authorization']).toBeUndefined()
  })
})
