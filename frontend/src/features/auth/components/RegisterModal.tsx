import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/entities/auth/hooks/useAuth'
import { RegisterRequest } from '@/shared/api/types'
import { AnimatedModal, Button, FormField } from '@/shared/ui'

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
  const { register: registerUser, isLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset
  } = useForm<RegisterForm>({ mode: 'onBlur' })

  const password = watch('password')
  const name = watch('name')
  const confirmPassword = watch('confirmPassword')

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsSubmitting(true)

      const registerData: RegisterRequest = {
        name: data.name,
        password: data.password,
        attributes: []
      }

      await registerUser(registerData)

      reset() // Очищаем форму ТОЛЬКО при успехе
      onClose() // Закрываем модалку ТОЛЬКО при успехе
      return true

    } catch (err) {
      // НЕ закрываем модалку, НЕ очищаем форму
      // Toast показывается автоматически в useAuth
      return false
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
      title="Get Started"
      maxWidth="md"
    >
      <div className="p-6">
        {/* Welcome message */}
        <div className="mb-6 text-center animate-slideUp">
          <p className="text-text-secondary text-sm">
            Join thousands of miners managing their operations with
            <span className="text-accent-green font-semibold"> Stratix</span>
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            label="Username"
            error={errors.name?.message}
            isValid={touchedFields.name && !errors.name && !!name}
            helperText="Choose a unique username (minimum 3 characters)"
            {...register('name', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message: 'Username can only contain letters, numbers, hyphens, and underscores'
              }
            })}
            type="text"
            placeholder="Choose a username"
            autoComplete="username"
          />

          <FormField
            label="Password"
            error={errors.password?.message}
            isValid={touchedFields.password && !errors.password && !!password}
            helperText="Password must be at least 6 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            type="password"
            placeholder="Create a secure password"
            autoComplete="new-password"
          />

          <FormField
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            isValid={!!(touchedFields.confirmPassword && !errors.confirmPassword && confirmPassword && confirmPassword === password)}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          {/* Terms checkbox */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 text-text-secondary text-sm cursor-pointer group">
              <input
                {...register('agreeTerms', { required: 'You must agree to the terms' })}
                type="checkbox"
                className="w-4 h-4 mt-0.5 accent-accent-green transition-transform group-hover:scale-110"
              />
              <span className="group-hover:text-text-primary transition-colors">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-accent-green hover:text-accent-green-hover underline transition-colors"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  className="text-accent-green hover:text-accent-green-hover underline transition-colors"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-accent-red text-sm animate-slideUp ml-7">
                {errors.agreeTerms.message}
              </p>
            )}
          </div>

          {/* Submit button с onClick вместо submit */}
          <Button
            onClick={() => handleSubmit(onSubmit)()}
            variant="primary"
            size="lg"
            isLoading={isSubmitting || isLoading}
            className="w-full"
            rightIcon={!isSubmitting && !isLoading ? '✨' : undefined}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border animate-slideUp delay-200">
          <p className="text-text-secondary text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-accent-green hover:text-accent-green-hover font-medium transition-colors hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </AnimatedModal>
  )
}