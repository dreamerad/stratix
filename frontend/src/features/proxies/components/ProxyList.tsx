import { useState } from 'react'
import { ProxyCard } from './ProxyCard'
import { ProxyEditModal } from './ProxyEditModal'
import { useProxies } from '../hooks/useProxies'
import type { Proxy } from '../api/proxies'

export function ProxyList() {
  const { proxies, loading, updateProxyStatus } = useProxies()
  const [editingProxy, setEditingProxy] = useState<Proxy | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = (proxy: Proxy) => {
    setEditingProxy(proxy)
    setIsEditModalOpen(true)
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingProxy(null)
  }

  const handleSaveProxy = async (proxyData: any) => {
    console.log('Saving proxy:', proxyData)
    // await proxiesApi.updateProxy(editingProxy?.proxy_id, proxyData)
  }

  const sortedProxies = proxies.sort((a, b) => {
    const aIsVia = a.proxy_id.toLowerCase().includes('via')
    const bIsVia = b.proxy_id.toLowerCase().includes('via')

    if (aIsVia && !bIsVia) return -1
    if (!aIsVia && bIsVia) return 1
    return 0
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-[#222222] border border-border rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="h-6 bg-gray-700 rounded mb-2 w-32"></div>
            <div className="h-px bg-gray-700 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (proxies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-muted text-lg mb-2">No proxies found</div>
        <div className="text-text-muted text-sm">No proxies available</div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedProxies.map((proxy) => (
          <ProxyCard
            key={proxy.proxy_id}
            proxy={proxy}
            onStatusUpdate={updateProxyStatus}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Edit Modal */}
      <ProxyEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        proxy={editingProxy}
      />
    </>
  )
}