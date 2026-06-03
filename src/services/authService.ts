import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const authService = {
  // ✅ Real API Call to your Spring Boot Backend
  login: async (data: LoginRequest) => {
    console.log("🚀 Attempting Real API Login for:", data.email)
    const response = await api.post('/auth/login', data)
    return response.data  // ← YAHAN CHANGE
  },

  signup: async (data: SignupRequest) => {
  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password
  }

  const response = await api.post('/auth/register', payload)
  return response.data
  },

  adminLogin: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data)
    return response.data  // ← YAHAN CHANGE
  },

  logout: async () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }
}