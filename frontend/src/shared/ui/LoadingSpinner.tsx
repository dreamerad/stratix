import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={clsx(
      'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50',
      className
    )}>
      <div className={clsx(
        'animate-spin rounded-full border-solid border-gray-600 border-t-accent-green',
        sizeClasses[size]
      )} />
    </div>
  )
}