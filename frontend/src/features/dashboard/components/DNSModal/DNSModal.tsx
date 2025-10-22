import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

interface DNSModalProps {
  isOpen: boolean
  onClose: () => void
}

const DNS_SERVERS = [
  '8.8.8.8',
  '1.1.1.1',
  '9.9.9.9',
  '208.67.222.222',
  '64.6.64.6'
]

export function DNSModal({ isOpen, onClose }: DNSModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  if (!isOpen) return null

  const copyToClipboard = async (dns: string, index: number) => {
    try {
      await navigator.clipboard.writeText(dns)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#222222] border border-border rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary text-lg font-semibold">Stratums</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {DNS_SERVERS.map((dns, index) => (
            <div
              key={dns}
              className="flex items-center justify-between bg-[#1a1a1a] border border-border rounded-lg p-3"
            >
              <span className="text-text-primary font-mono">{dns}</span>
              <button
                onClick={() => copyToClipboard(dns, index)}
                className="text-text-muted hover:text-[#00FF26] transition-colors flex items-center gap-1"
              >
                {copiedIndex === index ? (
                  <>
                    <Check size={16} className="text-[#00FF26]" />
                    <span className="text-xs text-[#00FF26]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}