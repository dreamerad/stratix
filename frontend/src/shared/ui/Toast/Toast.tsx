import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  closable?: boolean
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }

  const Icon = icons[toast.type]

  const typeStyles = {
    success: 'bg-green-900/90 border-green-500/50',
    error: 'bg-red-900/90 border-red-500/50',
    warning: 'bg-yellow-900/90 border-yellow-500/50',
    info: 'bg-blue-900/90 border-blue-500/50'
  }

  const iconStyles = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }

  return (
    <div className={clsx(
      'relative w-full max-w-sm bg-primary-card border rounded-lg shadow-xl p-4',
      'backdrop-blur-sm transform transition-all duration-300 ease-out',
      typeStyles[toast.type],
      isLeaving
        ? 'animate-slideOutRight opacity-0 scale-95'
        : 'animate-slideInRight opacity-100 scale-100',
      'hover:scale-105 hover:shadow-2xl group'
    )}>
      {/* Progress bar */}
      {toast.duration && (
        <div className="absolute top-0 left-0 h-1 bg-accent-green rounded-t-lg animate-shrink"
             style={{ animationDuration: `${toast.duration}ms` }} />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon size={20} className={iconStyles[toast.type]} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-text-primary font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>

        {/* Close button */}
        {toast.closable !== false && (
          <button
            onClick={handleRemove}
            className={clsx(
              'flex-shrink-0 w-6 h-6 rounded-full transition-all duration-200',
              'hover:bg-white/10 flex items-center justify-center',
              'text-text-muted hover:text-text-primary',
              'opacity-0 group-hover:opacity-100'
            )}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}