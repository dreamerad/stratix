import { create } from 'zustand'
import { authApi } from '@/shared/api/client'
import { User, LoginRequest, RegisterRequest } from '@/shared/api/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authApi.login(credentials)
      localStorage.setItem('access_token', response.access_token)

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null
      })
      throw error
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authApi.register(userData)
      set({
        user,
        isAuthenticated: false, // User needs to login after registration
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      set({
        error: errorMessage,
        isLoading: false
      })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('access_token')
    set({
      user: null,
      isAuthenticated: false,
      error: null
    })
  },

  clearError: () => {
    set({ error: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null })
      return
    }

    set({ isAuthenticated: true, isLoading: false })
  }
}))