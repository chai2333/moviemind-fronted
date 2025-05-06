import api from './api'
export function login(payload) { return api.post('/login/', payload) }
export function register(payload) { return api.post('/register/', payload) }