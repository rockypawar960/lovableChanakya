import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  confirmPassword: string
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
    const response = await api.post('/auth/signup', data)
    return response.data  // ← YAHAN CHANGE
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