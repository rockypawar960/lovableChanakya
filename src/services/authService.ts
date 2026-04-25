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
    return api.post('/auth/login', data)
  },

  signup: async (data: SignupRequest) => {
    return api.post('/auth/signup', data)
  },

  adminLogin: async (data: LoginRequest) => {
    return api.post('/auth/login', data)
  },

  logout: async () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }
}