import {create} from 'zustand'
import {authApi} from '@/shared/api/client'
import {LoginRequest, RegisterRequest, User} from '@/shared/api/types'

interface AuthState {
    user: User | null
    userData: UserData | null
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

interface UserData {
    name: string
    isAdmin: boolean
}

const decodeToken = (token: string): UserData | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            name: payload.username || payload.name || 'User',
            isAdmin: payload.is_admin || false
        }
    } catch {
        return null
    }
}
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    userData: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (credentials) => {
        set({isLoading: true, error: null})

        try {
            const response = await authApi.login(credentials)
            localStorage.setItem('access_token', response.access_token)
            const userData = decodeToken(response.access_token)
            set({
                isAuthenticated: true,
                isLoading: false,
                error: null,
                userData
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
        set({isLoading: true, error: null})

        try {
            const response = await authApi.register(userData)

            localStorage.setItem('access_token', response.token.access_token)

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            })

        } catch (error: any) {
            const errorMessage = error.response?.data?.detail || 'Registration failed'
            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false,
                user: null
            })

            throw error
        }
    },

    logout: () => {
        localStorage.removeItem('access_token')
        set({
            user: null,
            userData: null,
            isAuthenticated: false,
            error: null
        })

    },

    clearError: () => {
        set({error: null})
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token')

        if (!token) {
            set({isLoading: false, isAuthenticated: false, user: null})
            return
        }

        try {
            const userData = decodeToken(token)
            set({isAuthenticated: true, isLoading: false, userData})
        } catch (error) {
            localStorage.removeItem('access_token')
            set({isLoading: false, isAuthenticated: false, user: null, userData: null})
        }
    }
}))