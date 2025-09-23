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
        // user: response.user, // Убираем пока, пока не знаем структуру ответа
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      // НЕ throw error при успехе
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null
      })

      // ВАЖНО: выбрасываем ошибку дальше
      throw error
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authApi.register(userData)

      // Сохраняем токен и данные пользователя (seamless registration)
      localStorage.setItem('access_token', response.token.access_token)

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      // НЕ throw error при успехе
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,  // ВАЖНО: НЕ аутентифицирован при ошибке
        user: null              // ВАЖНО: очищаем пользователя при ошибке
      })

      // ВАЖНО: выбрасываем ошибку дальше
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

    // Toast показывается в компоненте через useAuth хук
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

    // Можно добавить проверку валидности токена
    try {
      // const user = await authApi.validateToken(token)
      // set({ user, isAuthenticated: true, isLoading: false })

      // Пока просто устанавливаем authenticated если токен есть
      set({ isAuthenticated: true, isLoading: false })
    } catch (error) {
      // Токен невалидный - очищаем
      localStorage.removeItem('access_token')
      set({ isLoading: false, isAuthenticated: false, user: null })
    }
  }
}))