import {useCallback, useEffect, useState} from 'react'
import {proxiesApi, type Proxy, type ProxyStats} from '../api/proxies'
import {useToastHelpers} from '@/shared/ui'

export function useProxies() {
    const [proxies, setProxies] = useState<Proxy[]>([])
    const [stats, setStats] = useState<ProxyStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const toast = useToastHelpers()

    const fetchProxies = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await proxiesApi.getProxies()
            setProxies(data.proxies)
            setStats(data.stats)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки прокси'
            setError(errorMessage)
            toast.error('Ошибка загрузки', errorMessage)

            setProxies([])
            setStats({_id: null, total: 0, active: 0, inactive: 0})
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProxyStatus = useCallback(async (proxyId: string, status: 'active' | 'inactive') => {
        try {
            await proxiesApi.updateProxyStatus(proxyId, status)

            setProxies(prev => prev.map(proxy =>
                proxy.proxy_id === proxyId
                    ? {...proxy, status, updated_at: new Date().toISOString()}
                    : proxy
            ))

            setStats(prev => {
                if (!prev) return null
                const activeChange = status === 'active' ? 1 : -1
                return {
                    ...prev,
                    active: prev.active + activeChange,
                    inactive: prev.inactive - activeChange
                }
            })

            toast.success(
                'Статус изменен',
                `Прокси ${proxyId} ${status === 'active' ? 'активирован' : 'деактивирован'}`
            )
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления статуса'
            toast.error('Ошибка', errorMessage)
        }
    }, [toast])

    const deleteProxy = useCallback(async (proxyId: string) => {
        try {
            const result = await proxiesApi.deleteProxy(proxyId)

            if (result.success) {
                const deletedProxy = proxies.find(p => p.proxy_id === proxyId)

                setProxies(prev => prev.filter(proxy => proxy.proxy_id !== proxyId))

                setStats(prev => {
                    if (!prev || !deletedProxy) return null
                    return {
                        ...prev,
                        total: prev.total - 1,
                        active: prev.active - (deletedProxy.status === 'active' ? 1 : 0),
                        inactive: prev.inactive - (deletedProxy.status === 'inactive' ? 1 : 0)
                    }
                })

                toast.success('Удалено', `Proxy ${proxyId} deleted successfully`)
                return true
            }
            return false
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting proxy'
            toast.error('Ошибка', errorMessage)
            return false
        }
    }, [toast, proxies])

    useEffect(() => {
        fetchProxies()
    }, [fetchProxies])

    return {
        proxies,
        stats,
        loading,
        error,
        updateProxyStatus,
        deleteProxy,
        refetch: fetchProxies
    }
}