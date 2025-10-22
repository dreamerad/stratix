import { useState } from 'react'
import { AnimatedModal, Button } from '@/shared/ui'

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean> | boolean
  title: string
  description: string
  itemName?: string
  warningText?: string
  confirmText?: string
  confirmVariant?: 'primary' | 'danger'
  isDestructive?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  warningText,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  isDestructive = false
}: ConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const result = await onConfirm()
      if (result) {
        onClose()
      }
    } catch (error) {
      console.error('Confirmation action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      onClose()
    }
  }

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="sm"
    >
      <div className="p-6">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
          isDestructive 
            ? 'bg-red-500/10' 
            : 'bg-accent-green/10'
        }`}>
          {isDestructive ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-green">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-text-primary text-lg font-semibold mb-2">
            {title}
          </h3>
          <p className="text-text-muted text-sm mb-4">
            {description}
            {itemName && (
              <span className="text-text-primary font-medium"> "{itemName}"</span>
            )}
            ?
          </p>

          {warningText && (
            <div className={`border rounded-lg p-3 ${
              isDestructive 
                ? 'bg-red-500/10 border-red-500/20' 
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}>
              <p className={`text-sm font-medium ${
                isDestructive ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {warningText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-[#1A1A1A] px-6 py-4 flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          isLoading={isProcessing}
          disabled={isProcessing}
          className={
            confirmVariant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20'
              : ''
          }
        >
          {confirmText}
        </Button>
      </div>
    </AnimatedModal>
  )
}