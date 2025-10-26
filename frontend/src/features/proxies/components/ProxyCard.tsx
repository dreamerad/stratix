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

    const isViaPool = proxy.proxy_id.toLowerCase().includes('via')

    return (
        <div
            className={`bg-[#222222] border rounded-xl p-4 transition-all duration-300 group ${
                isViaPool 
                    ? 'border-[#00FF26]/50 hover:border-[#00FF26] shadow-[0_0_10px_rgba(0,255,38,0.1)]' 
                    : 'border-border hover:border-accent-green/30'
            }`}>
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
            <div className="flex items-center gap-2 mb-4">
                {isViaPool && (
                    <svg width="32" height="32" viewBox="0 0 271.64 277.95" className="flex-shrink-0">
                        <path fill="#52cbca" d="M215.67,62l-.86,1.06-.94-1a107.68,107.68,0,0,0-65-32.89l-1.06-.13V0l1.33.14A136.72,136.72,0,0,1,239.68,47.8l1.52,1.79-2.34.19A33.19,33.19,0,0,0,215.67,62Z"/>
                        <path fill="#52cbca" d="M266.1,104.53l1.53-1.73.54,2.25a127.73,127.73,0,0,1,3.47,30.37,135.72,135.72,0,0,1-14.38,60.46l-.63,1.24-23.88-16.69.43-.92a103.84,103.84,0,0,0,9.65-44.09,105.69,105.69,0,0,0-1.56-18.27l-.24-1.34,1.36-.07A33.77,33.77,0,0,0,266.1,104.53Z"/>
                        <path fill="#52cbca" d="M28.8,135.42a103.7,103.7,0,0,0,9.66,44.09l.43.92L15,197.11l-.63-1.22A131.4,131.4,0,0,1,0,135.42a138.42,138.42,0,0,1,2.93-28l.43-2.07,1.56,1.43a34.06,34.06,0,0,0,22.68,8.92h3l-.25,1.41A105.7,105.7,0,0,0,28.8,135.42Z"/>
                        <path fill="#52cbca" d="M56.47,63.64l-1,1.12-.87-1.22A34.22,34.22,0,0,0,32.68,49.77l-2.07-.35L32,47.81A135,135,0,0,1,122.51.14L123.83,0V29.06l-1.07.13A106.75,106.75,0,0,0,56.47,63.64Z"/>
                        <path fill="#52cbca" d="M51.33,201.1l.7.87a107.52,107.52,0,0,0,53.25,36l1.34.4-.59,1.27a34.56,34.56,0,0,0-3.32,14.53,33.92,33.92,0,0,0,2,11.47l.76,2.11-2.18-.54a135.19,135.19,0,0,1-74.84-48.73l-.77-1Z"/>
                        <path fill="#52cbca" d="M165.61,239.67l-.6-1.27,1.35-.4a107.54,107.54,0,0,0,53.24-36l.71-.87,23.61,16.41-.78,1a136.55,136.55,0,0,1-74.83,48.73l-2.18.54.76-2.11a33.92,33.92,0,0,0,2-11.47A34.72,34.72,0,0,0,165.61,239.67Z"/>
                        <path fill="#52cbca" d="M241.4,106.39a23.76,23.76,0,1,1,23.75-23.76A23.76,23.76,0,0,1,241.4,106.39Zm-213.8,0A23.76,23.76,0,1,1,51.36,82.63,23.76,23.76,0,0,1,27.6,106.39ZM135.82,278a23.76,23.76,0,1,1,23.75-23.75A23.75,23.75,0,0,1,135.82,278Z"/>
                        <path fill="#ffb900" d="M169.08,112.72c-4.23,17.16-30.62,8.45-39.33,6.34L137.4,89c8.45,1.84,35.9,6.07,31.68,23.75Zm-4.76,48.83c-4.75,19-36.42,8.71-46.71,6.07l8.44-33.26c10,2.64,43,7.66,38.27,27.19Zm4.23-83.41,6.07-24.81-15.05-4L153.5,73.66c-4-1.06-7.92-1.85-12.14-2.91l6.07-24.28-15-3.69-6.34,24.81c-3.17-.8-6.6-1.59-9.76-2.12L95.43,60.2l-4,16.1,11.08,2.64c6.07,1.58,7.13,5.54,7.13,8.71l-7.13,28.24c.53.26,1.06.26,1.58.53-.52-.27-1-.27-1.58-.53l-9.77,39.85c-.79,1.85-2.63,4.76-6.86,3.7.27.26-11.08-2.64-11.08-2.64l-7.66,17.42L86.72,179c3.7,1.06,7.13,1.85,10.83,2.91L91.21,207l15.05,3.7,6.33-24.82c4,1.06,8.18,2.12,12.14,3.17l-6.33,24.55,15,3.69,6.34-25.07c25.86,4.75,45.13,2.9,53.31-20.32,6.6-18.74-.26-29.83-14-36.69,10.29-2.11,17.68-8.71,19.79-22.17C201.54,94.51,187.55,84.74,168.55,78.14Z"/>
                    </svg>
                )}
                <h3 className={`font-semibold text-lg group-hover:text-accent-green transition-colors ${
                    isViaPool ? 'text-[#00FF26]' : 'text-text-primary'
                }`}>
                    {proxy.proxy_id.split('-')[0]}
                </h3>
            </div>

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