import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { LoginRequest } from '@/shared/api/types'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login, error, clearError, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginRequest>()

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsSubmitting(true)
      clearError()
      await login(data)
      reset()
      onClose()
    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    clearError()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-modal border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Welcome Back</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-primary-card border border-border rounded-sm text-text-muted hover:bg-primary-card-hover hover:border-accent-red hover:text-accent-red transition-all flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-accent-red text-accent-red p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-text-primary font-medium text-sm mb-2">
                Username
              </label>
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                className="w-full p-3 bg-primary-bg-secondary border border-border rounded-md text-text-primary transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                placeholder="Enter your username"
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-accent-red text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-text-primary font-medium text-sm mb-2">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full p-3 bg-primary-bg-secondary border border-border rounded-md text-text-primary transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-accent-red text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-accent-green"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-accent-green hover:text-accent-green-hover transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-accent-green text-primary-bg font-semibold py-3 rounded-md hover:bg-accent-green-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-accent-green hover:text-accent-green-hover font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}