import { clsx } from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  variant?: 'green' | 'blue' | 'purple'
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

export function Toggle({
  checked,
  onChange,
  variant = 'green',
  size = 'md',
  disabled = false,
  className
}: ToggleProps) {
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3'
    },
    md: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4'
    }
  }

  const variantClasses = {
    green: checked
      ? 'bg-[#00FF26]'
      : 'bg-gray-600',
    blue: checked
      ? 'bg-blue-500'
      : 'bg-gray-600',
    purple: checked
      ? 'bg-purple-500'
      : 'bg-gray-600'
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={clsx(
        'relative rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg',
        sizeClasses[size].track,
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        variant === 'green' && 'focus:ring-[#00FF26]/50',
        variant === 'blue' && 'focus:ring-blue-500/50',
        variant === 'purple' && 'focus:ring-purple-500/50',
        className
      )}
    >
      {/* Thumb (кружок) */}
      <div
        className={clsx(
          'absolute top-0.5 bg-white rounded-full transition-transform duration-200 shadow-sm',
          sizeClasses[size].thumb,
          checked
            ? size === 'sm' ? 'translate-x-4' : 'translate-x-5'
            : 'translate-x-0.5'
        )}
      />
    </button>
  )
}