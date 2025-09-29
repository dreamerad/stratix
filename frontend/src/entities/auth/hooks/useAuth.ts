import {useAuthStore} from '@/entities/auth/store/authStore'
import {useToastHelpers} from '@/shared/ui'
import {LoginRequest, RegisterRequest} from '@/shared/api/types'

export function useAuth() {
    const {
        user,
        userData,
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

    const login = async (credentials: LoginRequest) => {
        try {
            await storeLogin(credentials)

            toast.success(
                'Welcome back!',
                `Successfully signed in as ${credentials.username}`
            )
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail || 'Login failed'
            toast.error('Login Failed', errorMessage)
            throw error
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            await storeRegister(userData)

            toast.success(
                'Account Created!',
                `Welcome to Stratix, ${userData.name}! You are now logged in.`
            )
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.detail || 'Registration failed'
            toast.error('Registration Failed', errorMessage)
            throw error
        }
    }

    const logout = () => {
        storeLogout()
        toast.info(
            'Signed Out',
            'You have been successfully signed out'
        )
    }

    return {
        user,
        userData,
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