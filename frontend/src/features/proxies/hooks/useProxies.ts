import {useCallback, useEffect, useState} from 'react'
import {proxiesApi, type Proxy, type ProxyStats} from '../api/proxies'
import {useToast} from '@/shared/ui'

export function useProxies() {
    const [proxies, setProxies] = useState<Proxy[]>([])
    const [stats, setStats] = useState<ProxyStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const {showToast} = useToast()

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
            showToast({message: errorMessage, type: 'error'})

            setProxies([])
            setStats({_id: null, total: 0, active: 0, inactive: 0})
        } finally {
            setLoading(false)
        }
    }, [showToast])

    const updateProxyStatus = useCallback(async (proxyId: string, status: 'active' | 'inactive') => {
        try {
            // await proxiesApi.updateProxyStatus(proxyId, status)

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

            showToast({
                message: `Прокси ${proxyId} ${status === 'active' ? 'активирован' : 'деактивирован'}`,
                type: 'success'
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления статуса'
            showToast({message: errorMessage, type: 'error'})
        }
    }, [showToast])

    const deleteProxy = useCallback(async (proxyId: string) => {
        try {
            const result = await proxiesApi.deleteProxy(proxyId)

            if (result.success) {
                setProxies(prev => prev.filter(proxy => proxy.proxy_id !== proxyId))

                setStats(prev => {
                    if (!prev) return null
                    return {
                        ...prev,
                        total: prev.total - 1,
                        active: prev.active - (proxies.find(p => p.proxy_id === proxyId)?.status === 'active' ? 1 : 0),
                        inactive: prev.inactive - (proxies.find(p => p.proxy_id === proxyId)?.status === 'inactive' ? 1 : 0)
                    }
                })

                showToast({message: `Proxy ${proxyId} deleted successfully`, type: 'success'})
                return true
            }
            return false
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error deleting proxy'
            showToast({message: errorMessage, type: 'error'})
            return false
        }
    }, [showToast, proxies])

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