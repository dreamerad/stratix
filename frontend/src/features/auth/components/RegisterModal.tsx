import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { RegisterRequest } from '@/shared/api/types'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

interface RegisterForm {
  name: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register: registerUser, error, clearError, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsSubmitting(true)
      clearError()

      const registerData: RegisterRequest = {
        name: data.name,
        password: data.password,
        attributes: [] // For now, no attributes for regular users
      }

      await registerUser(registerData)
      setSuccess(true)
      reset()

      // Auto switch to login after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        onSwitchToLogin()
      }, 2000)

    } catch (err) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    clearError()
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-modal border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Get Started</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-primary-card border border-border rounded-sm text-text-muted hover:bg-primary-card-hover hover:border-accent-red hover:text-accent-red transition-all flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-accent-green text-accent-green p-3 rounded-md text-sm text-center">
              Account created successfully! Redirecting to login...
            </div>
          )}

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
                {...register('name', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
                type="text"
                className="w-full p-3 bg-primary-bg-secondary border border-border rounded-md text-text-primary transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                placeholder="Choose a username"
                autoComplete="username"
              />
              {errors.name && (
                <p className="text-accent-red text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-text-primary font-medium text-sm mb-2">
                Password
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                type="password"
                className="w-full p-3 bg-primary-bg-secondary border border-border rounded-md text-text-primary transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                placeholder="Create a password"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-accent-red text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-text-primary font-medium text-sm mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                type="password"
                className="w-full p-3 bg-primary-bg-secondary border border-border rounded-md text-text-primary transition-all focus:border-accent-green focus:shadow-[0_0_0_3px_rgba(0,255,136,0.1)]"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-accent-red text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-3 text-text-secondary text-sm cursor-pointer">
                <input
                  {...register('agreeTerms', { required: 'You must agree to the terms' })}
                  type="checkbox"
                  className="w-4 h-4 accent-accent-green"
                />
                I agree to the{' '}
                <button type="button" className="text-accent-green hover:text-accent-green-hover">
                  Terms of Service
                </button>
              </label>
              {errors.agreeTerms && (
                <p className="text-accent-red text-sm mt-1">{errors.agreeTerms.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading || success}
              className="w-full bg-accent-green text-primary-bg font-semibold py-3 rounded-md hover:bg-accent-green-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : success ? 'Account Created!' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-border">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-accent-green hover:text-accent-green-hover font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}