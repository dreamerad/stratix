import { useState, useEffect, useMemo } from 'react'
import { workerHistoryApi, WorkersHistoryAllResponse, WorkerHistoryAllDataPoint } from '../api/workerHistory'
import { useCurrency } from '@/shared/providers/CurrencyProvider'

type TimeRange = 1 | 6 | 24 | 48 | 168

export function useAllWorkersHistory() {
  const [allData, setAllData] = useState<WorkersHistoryAllResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(24)
  const { currency } = useCurrency()

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const response = await workerHistoryApi.getAllWorkersHistory(selectedTimeRange, currency)
        setAllData(response)
      } catch (error) {
        console.error('Failed to fetch all workers history:', error)
        setAllData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [selectedTimeRange, currency])

  const getGroupData = useMemo(() => {
    return (groupName: string): WorkerHistoryAllDataPoint[] => {
      if (!allData) return []

      const groupWorkers = Object.keys(allData.workers)
        .filter(workerName => workerName.startsWith(groupName + '.'))

      if (groupWorkers.length === 0) return []

      const groupedData: { [timestamp: number]: number } = {}

      groupWorkers.forEach(workerName => {
        const workerData = allData.workers[workerName] || []
        workerData.forEach(point => {
          groupedData[point.timestamp] = (groupedData[point.timestamp] || 0) + point.raw_hashrate
        })
      })

      return Object.entries(groupedData)
        .map(([timestamp, raw_hashrate]) => ({
          timestamp: parseInt(timestamp),
          raw_hashrate
        }))
        .sort((a, b) => a.timestamp - b.timestamp)
    }
  }, [allData])

  const getWorkerData = useMemo(() => {
    return (workerName: string): WorkerHistoryAllDataPoint[] => {
      if (!allData) return []
      return allData.workers[workerName] || []
    }
  }, [allData])

return {
  loading,
  selectedTimeRange,
  setSelectedTimeRange,
  getGroupData,
  getWorkerData,
  currency,
  allData
}
}