import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'


export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  error?: string
  isValid?: boolean
  helperText?: string
  className?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, isValid, helperText, className, ...props }, ref) => {
    const hasError = !!error
    const showSuccess = isValid && !hasError && props.value

    return (
      <div className={clsx('space-y-2', className)}>
        {/* Label с анимацией */}
        <label className={clsx(
          'block font-medium text-sm transition-colors duration-200',
          hasError ? 'text-accent-red' : 'text-text-primary',
          'animate-slideUp'
        )}>
          {label}
        </label>

        {/* Input wrapper для анимированной рамки */}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={clsx(
              'w-full p-3 rounded-md text-text-primary transition-all duration-300',
              'bg-primary-bg-secondary border border-border',
              'placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-accent-green/20',

              // Состояния
              hasError && [
                'border-accent-red',
                'focus:border-accent-red focus:ring-accent-red/20',
                'animate-shake'
              ],

              showSuccess && [
                'border-accent-green',
                'focus:border-accent-green'
              ],

              !hasError && !showSuccess && [
                'hover:border-border-hover',
                'focus:border-accent-green'
              ],

              // Анимация при фокусе
              'transform transition-transform duration-200',
              'focus:scale-[1.01]'
            )}
          />

          {/* Иконки состояния */}
          {(hasError || showSuccess) && (
            <div className={clsx(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'animate-scaleIn'
            )}>
              {hasError && (
                <div className="w-5 h-5 bg-accent-red rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
              {showSuccess && (
                <div className="w-5 h-5 bg-accent-green rounded-full flex items-center justify-center">
                  <span className="text-primary-bg text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error/Helper text с анимацией */}
        <div className="min-h-[1.25rem]">
          {hasError && (
            <p className={clsx(
              'text-accent-red text-sm',
              'animate-slideUp animate-pulse'
            )}>
              {error}
            </p>
          )}
          {!hasError && helperText && (
            <p className="text-text-muted text-sm animate-slideUp">
              {helperText}
            </p>
          )}
        </div>
      </div>
    )
  }
)

FormField.displayName = 'FormField'