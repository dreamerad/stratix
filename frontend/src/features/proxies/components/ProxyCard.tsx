import type {Proxy} from '../api/proxies'

interface ProxyCardProps {
    proxy: Proxy
    onStatusUpdate: (proxyId: string, status: 'active' | 'inactive') => void
    onDelete?: (proxyId: string) => void
    onEdit?: (proxy: Proxy) => void
}

export function ProxyCard({proxy, onEdit}: ProxyCardProps) {
    // const [isLoading, setIsLoading] = useState(false)
    //
    // const handleStatusToggle = async () => {
    //   setIsLoading(true)
    //   const newStatus = proxy.status === 'active' ? 'inactive' : 'active'
    //   await onStatusUpdate(proxy.proxy_id, newStatus)
    //   setIsLoading(false)
    // }

    const getMainFee = () => {
        const fee = proxy.config['sha256-stratum'].debug.fee[0]
        return fee ? `${fee.percent}%` : '0%'
    }

    const getAccountFeesCount = () => {
        const accountFees = proxy.config['sha256-stratum'].debug.account_fees
        return Object.keys(accountFees).length
    }

    return (
        <div
            className="bg-[#222222] border border-border rounded-xl p-4 hover:border-accent-green/30 transition-all duration-300 group">
            {/* Header с фи */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-md font-medium text-[#00FF26] bg-[#00FF26]/10">
            {getMainFee()}
          </span>

                    {getAccountFeesCount() > 0 && (
                        <div className="flex items-center gap-1 bg-[#FFFFFF12] rounded-md px-2 py-1">
              <span className="text-xs font-medium text-purple-400">
                {getAccountFeesCount()} custom fees
              </span>
                        </div>
                    )}
                </div>

            </div>

            {/* Proxy ID */}
            <h3 className="text-text-primary font-semibold text-lg mb-4 group-hover:text-accent-green transition-colors">
                {proxy.proxy_id.split('-')[0]}
            </h3>

            {/* Divider */}
            <div className="h-px w-full bg-[#313131] mb-4"></div>

            {/* Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit?.(proxy)}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-accent-green hover:bg-accent-green/10 transition-colors"
                        title="Edit proxy"
                    >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M14.166 2.5C14.3849 2.28113 14.6447 2.10752 14.9307 1.98906C15.2167 1.87061 15.5232 1.80957 15.8327 1.80957C16.1422 1.80957 16.4487 1.87061 16.7347 1.98906C17.0206 2.10752 17.2805 2.28113 17.4993 2.5C17.7182 2.71887 17.8918 2.97869 18.0103 3.26466C18.1287 3.55063 18.1898 3.85705 18.1898 4.16667C18.1898 4.47628 18.1287 4.78271 18.0103 5.06868C17.8918 5.35465 17.7182 5.61447 17.4993 5.83333L6.24935 17.0833L1.66602 18.3333L2.91602 13.75L14.166 2.5Z"
                                stroke="#7A7A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    )
}