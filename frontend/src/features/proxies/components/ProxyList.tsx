import { useState, useMemo } from 'react'
import { ProxyCard } from './ProxyCard'
import { ProxyEditModal } from './ProxyEditModal'
import { ConfirmationModal } from '@/shared/ui/ConfirmationModal'
import { useProxies } from '../hooks/useProxies'
import type { Proxy } from '../api/proxies'

type ProxyFilter = 'All' | 'Active' | 'Inactive'
type ProxySortOption = 'Name A-Z' | 'Name Z-A' | 'Date newest' | 'Date oldest'

interface ProxyListProps {
  searchTerm: string
  filterStatus: ProxyFilter
  sortBy: ProxySortOption
}

export function ProxyList({ searchTerm, filterStatus, sortBy }: ProxyListProps) {
  const { proxies, loading, updateProxyStatus, deleteProxy } = useProxies()
  const [editingProxy, setEditingProxy] = useState<Proxy | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingProxyId, setDeletingProxyId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const filteredAndSortedProxies = useMemo(() => {
    let filtered = [...proxies]

    if (searchTerm) {
      filtered = filtered.filter(proxy =>
        proxy.proxy_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'All') {
      const status = filterStatus.toLowerCase() as 'active' | 'inactive'
      filtered = filtered.filter(proxy => proxy.status === status)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Name A-Z':
          return a.proxy_id.localeCompare(b.proxy_id)
        case 'Name Z-A':
          return b.proxy_id.localeCompare(a.proxy_id)
        case 'Date newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'Date oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [proxies, searchTerm, filterStatus, sortBy])

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

  const handleDelete = (proxyId: string) => {
    setDeletingProxyId(proxyId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setDeletingProxyId(null)
  }

  const handleConfirmDelete = async (proxyId: string) => {
    return await deleteProxy(proxyId)
  }

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
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
            <div className="h-px bg-gray-700 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filteredAndSortedProxies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-muted text-lg mb-2">No proxies found</div>
        <div className="text-text-muted text-sm">
          {searchTerm ? 'Try adjusting your search criteria' : 'No proxies available'}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedProxies.map((proxy) => (
          <ProxyCard
            key={proxy.proxy_id}
            proxy={proxy}
            onStatusUpdate={updateProxyStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      <ProxyEditModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        proxy={editingProxy}
        onSave={handleSaveProxy}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={() => handleConfirmDelete(deletingProxyId!)}
        title="Delete Proxy"
        description="Are you sure you want to delete proxy"
        itemName={deletingProxyId}
        warningText="This action cannot be undone. All associated configurations will be permanently removed."
        confirmText="Delete Proxy"
        confirmVariant="danger"
        isDestructive={true}
      />
    </>
  )
}