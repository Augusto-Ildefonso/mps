import api from '../api'

export async function loginUser(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function createUser({ cpf, name, email, password }) {
  const response = await api.post('/users/create', { cpf, name, email, password })
  return response.data
}

export async function getUser(cpf) {
  const response = await api.get(`/users/${cpf}`)
  return response.data
}

export async function updateUser(cpf, data) {
  const response = await api.put(`/users/update/${cpf}`, data)
  return response.data
}

export async function deleteUser(cpf) {
  await api.delete(`/users/delete/${cpf}`)
}

export async function addAddress(data) {
  const response = await api.post('/address/add', data)
  return response.data
}

export async function listAddresses() {
  const response = await api.get('/address/list')
  return response.data
}
