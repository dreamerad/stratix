import { ReactNode, useEffect } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

export interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className
}: AnimatedModalProps) {
  // Блокируем скролл body когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }

  if (!isOpen) return null

  return (
    <div className={clsx(
      'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4',
      'animate-fadeIn'
    )}>
      {/* Overlay для закрытия по клику вне модалки */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Модальное окно */}
      <div className={clsx(
        'bg-primary-modal border border-border rounded-xl w-full max-h-[90vh] overflow-hidden relative',
        'animate-scaleIn shadow-2xl',
        maxWidthClasses[maxWidth],
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-primary-modal">
          <h2 className="text-xl font-semibold text-text-primary animate-slideUp">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={clsx(
              'w-8 h-8 bg-primary-card border border-border rounded-sm text-text-muted',
              'hover:bg-primary-card-hover hover:border-accent-red hover:text-accent-red',
              'transition-all duration-200 flex items-center justify-center',
              'hover:scale-110 hover:rotate-90'
            )}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] animate-slideUp delay-100">
          {children}
        </div>
      </div>
    </div>
  )
}