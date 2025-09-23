import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { LoginRequest } from '@/shared/api/types'
import { AnimatedModal, FormField, Button } from '@/shared/ui'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset
  } = useForm<LoginRequest>({ mode: 'onBlur' })

  const username = watch('username')
  const password = watch('password')

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsSubmitting(true)
      await login(data)
      reset()
      onClose() // Закрываем модалку только при успехе
    } catch (err) {
      // Ошибка уже показана через toast в useAuth
      // Модалку НЕ закрываем, чтобы пользователь мог попробовать снова
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome Back"
      maxWidth="md"
    >
      <div className="p-6">
        {/* Toast-система показывает ошибки автоматически */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            label="Username or Email"
            error={errors.username?.message}
            isValid={touchedFields.username && !errors.username && !!username}
            helperText="Enter your username or email address"
            {...register('username', { required: 'Username is required' })}
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
          />

          <FormField
            label="Password"
            error={errors.password?.message}
            isValid={touchedFields.password && !errors.password && !!password}
            {...register('password', { required: 'Password is required' })}
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {/* Additional options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-accent-green transition-transform group-hover:scale-110"
              />
              <span className="group-hover:text-text-primary transition-colors">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-accent-green hover:text-accent-green-hover transition-colors hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting || isLoading}
            className="w-full"
            rightIcon={!isSubmitting && !isLoading ? '🔑' : undefined}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-primary-card/50 rounded-lg border border-border animate-slideUp delay-100">
          <p className="text-accent-green font-semibold text-sm mb-2 text-center">
            Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-text-muted">Username:</span>
              <code className="ml-1 bg-primary-bg-secondary px-2 py-1 rounded text-accent-green">
                admin
              </code>
            </div>
            <div>
              <span className="text-text-muted">Password:</span>
              <code className="ml-1 bg-primary-bg-secondary px-2 py-1 rounded text-accent-green">
                admin
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border animate-slideUp delay-200">
          <p className="text-text-secondary text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-accent-green hover:text-accent-green-hover font-medium transition-colors hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </AnimatedModal>
  )
}