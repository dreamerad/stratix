import { useAuthStore } from '@/entities/auth/store/authStore'
import { useToastHelpers } from '@/shared/ui'
import { LoginRequest, RegisterRequest } from '@/shared/api/types'

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    clearError,
    checkAuth
  } = useAuthStore()

  const toast = useToastHelpers()

  // Обертка для login с toast
  const login = async (credentials: LoginRequest) => {
    try {
      await storeLogin(credentials)

      // Показываем успешный toast (используем имя из credentials, так как user может быть еще не обновлен)
      toast.success(
        'Welcome back!',
        `Successfully signed in as ${credentials.username}`
      )
    } catch (error) {
      // Показываем ошибку через toast
      const errorMessage = (error as any)?.response?.data?.detail || 'Login failed'
      toast.error('Login Failed', errorMessage)
      throw error
    }
  }

  // Обертка для register с toast
  const register = async (userData: RegisterRequest) => {
    console.log('useAuth: Starting registration...')
    try {
      await storeRegister(userData)

      console.log('useAuth: Registration successful!')
      // Показываем успешный toast
      toast.success(
        'Account Created!',
        `Welcome to Stratix, ${userData.name}! You are now logged in.`
      )
    } catch (error) {
      console.log('useAuth: Registration failed, showing error toast:', error)
      // Показываем ошибку через toast
      const errorMessage = (error as any)?.response?.data?.detail || 'Registration failed'
      toast.error('Registration Failed', errorMessage)

      console.log('useAuth: Re-throwing error to modal...')
      throw error
    }
  }

  // Обертка для logout с toast
  const logout = () => {
    storeLogout()
    toast.info(
      'Signed Out',
      'You have been successfully signed out'
    )
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth
  }
}