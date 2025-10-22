import { useProxies } from '../hooks/useProxies'

export function ProxyStats() {
  const { stats, loading } = useProxies()

  if (loading) {
    return (
      <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-1"></div>
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          <div className="border-t border-border my-6"></div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
      {/* Total proxies */}
      <div className="mb-6">
        <h3 className="text-text-white text-sm mb-1 font-semibold">Total proxies</h3>
        <div className="text-text-primary text-3xl">{stats?.total || 0}</div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-6"></div>

      {/* Proxies status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">{stats?.active || 0} active</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">{stats?.inactive || 0} inactive</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-2 text-text-muted text-sm mt-auto">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 13.3333V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"/>
          <path d="M10 6.66667H10.0083" stroke="white" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
        <span className="text-white">Proxy servers manage mining connections</span>
      </div>
    </div>
  )
}