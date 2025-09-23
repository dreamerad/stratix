import { createContext, useContext, useState, ReactNode } from 'react'
import { Toast, ToastItem } from './Toast'

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Helper hook для быстрого создания toasts
export function useToastHelpers() {
  const { addToast } = useToast()

  return {
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message, duration: 4000 }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message, duration: 6000 }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message, duration: 5000 }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message, duration: 4000 })
  }
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toastData: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast: Toast = {
      id,
      duration: 4000,
      closable: true,
      ...toastData
    }

    setToasts(prev => [...prev, toast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearAllToasts = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllToasts }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
        <div className="space-y-3 pointer-events-auto">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}