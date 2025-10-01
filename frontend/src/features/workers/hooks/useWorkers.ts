import { useEffect, useState } from 'react'
import { workersApi, Worker } from '../api/workers'
import { useCurrency } from '@/shared/providers/CurrencyProvider'

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const { currency } = useCurrency()

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true)
        const response = await workersApi.getWorkers(currency)
        setWorkers(response.workers)
      } catch (error) {
        console.error('Failed to fetch workers:', error)
        setWorkers([])
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [currency])

  const totalWorkers = workers.length
  const activeWorkers = workers.filter(worker => worker.is_active).length
  const inactiveWorkers = totalWorkers - activeWorkers

  return {
    workers,
    loading,
    totalWorkers,
    activeWorkers,
    inactiveWorkers
  }
}