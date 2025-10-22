import { useState } from 'react'
import { clsx } from 'clsx'
import type { Proxy } from '../api/proxies'

interface ProxyCardProps {
  proxy: Proxy
  onStatusUpdate: (proxyId: string, status: 'active' | 'inactive') => void
  onEdit?: (proxy: Proxy) => void
  onDelete?: (proxyId: string) => void
}

export function ProxyCard({ proxy, onStatusUpdate, onEdit, onDelete }: ProxyCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusToggle = async () => {
    setIsLoading(true)
    const newStatus = proxy.status === 'active' ? 'inactive' : 'active'
    await onStatusUpdate(proxy.proxy_id, newStatus)
    setIsLoading(false)
  }

  const getMainFee = () => {
    const fee = proxy.config['sha256-stratum'].debug.fee[0]
    return fee ? `${fee.percent}%` : 'N/A'
  }

  const getAccountFeesCount = () => {
    const accountFees = proxy.config['sha256-stratum'].debug.account_fees
    return Object.keys(accountFees).length
  }

  return (
    <div className="bg-[#222222] border border-border rounded-xl p-4 hover:border-accent-green/30 transition-all duration-300 group">
      {/* Header с статусом */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'text-xs px-3 py-1 rounded-md font-medium',
              proxy.status === 'active'
                ? 'text-[#00FF26] bg-[#00FF26]/10'
                : 'text-red-500 bg-red-500/10'
            )}
          >
            {proxy.status === 'active' ? 'Active' : 'Inactive'}
          </span>

          {getAccountFeesCount() > 0 && (
            <div className="flex items-center gap-1 bg-[#FFFFFF12] rounded-md px-2 py-1">
              <span className="text-xs font-medium text-purple-400">
                {getAccountFeesCount()} custom fees
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-text-muted">
          Fee: {getMainFee()}
        </div>
      </div>

      {/* Proxy ID */}
      <h3 className="text-text-primary font-semibold text-lg mb-2 group-hover:text-accent-green transition-colors">
        {proxy.proxy_id}
      </h3>

      {/* Даты */}
      <div className="space-y-1 mb-4">
        <div className="text-text-muted text-sm">
          Created: {formatDate(proxy.created_at)}
        </div>
        <div className="text-text-muted text-sm">
          Updated: {formatDate(proxy.updated_at)}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#313131] mb-4"></div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Toggle Status Button */}
          <button
            onClick={handleStatusToggle}
            disabled={isLoading}
            className={clsx(
              'w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
              'hover:border-accent-green hover:bg-accent-green/10',
              proxy.status === 'active'
                ? 'border-red-500 hover:border-red-500 hover:bg-red-500/10'
                : 'border-accent-green',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            title={proxy.status === 'active' ? 'Deactivate' : 'Activate'}
          >
            {proxy.status === 'active' ? (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
                      stroke="#ef4444" strokeWidth="1.5"/>
                <path d="M12.5 7.5L7.5 12.5M7.5 7.5L12.5 12.5"
                      stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M8.33333 10L10.8333 12.5L16.6667 6.66667M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z"
                      stroke="#00FF26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit?.(proxy)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent-green hover:bg-accent-green/10 transition-colors"
            title="Edit proxy"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M14.166 2.5C14.3849 2.28113 14.6447 2.10752 14.9307 1.98906C15.2167 1.87061 15.5232 1.80957 15.8327 1.80957C16.1422 1.80957 16.4487 1.87061 16.7347 1.98906C17.0206 2.10752 17.2805 2.28113 17.4993 2.5C17.7182 2.71887 17.8918 2.97869 18.0103 3.26466C18.1287 3.55063 18.1898 3.85705 18.1898 4.16667C18.1898 4.47628 18.1287 4.78271 18.0103 5.06868C17.8918 5.35465 17.7182 5.61447 17.4993 5.83333L6.24935 17.0833L1.66602 18.3333L2.91602 13.75L14.166 2.5Z"
                    stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete?.(proxy.proxy_id)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete proxy"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 5H4.16667M4.16667 5H17.5M4.16667 5V16.6667C4.16667 17.1087 4.34226 17.5326 4.65482 17.8452C4.96738 18.1577 5.39131 18.3333 5.83333 18.3333H14.1667C14.6087 18.3333 15.0326 18.1577 15.3452 17.8452C15.6577 17.5326 15.8333 17.1087 15.8333 16.6667V5H4.16667ZM6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667"
                    stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="text-text-muted text-xs">
          ID: {proxy.proxy_id}
        </div>
      </div>
    </div>
  )
}