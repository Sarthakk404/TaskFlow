import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export const getTasks  = (params) => API.get('/tasks/', { params })
export const createTask = (data)  => API.post('/tasks/', data)
export const updateTask = (id, data) => API.patch(`/tasks/${id}/`, data)
export const deleteTask = (id)    => API.delete(`/tasks/${id}/`)

export const register = (data) => API.post('/auth/register/', data)
export const login    = (data) => API.post('/auth/login/', data)
export const logout   = ()     => API.post('/auth/logout/')
export const getMe    = ()     => API.get('/auth/me/')

export default API
