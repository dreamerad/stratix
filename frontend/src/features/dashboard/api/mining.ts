import { apiClient } from '@/shared/api/client'

export interface HashrateStats {
  current: number
  hourly: number
  daily: number
  currency: 'BTC' | 'LTC'
}

export interface ChartDataPoint {
  timestamp: number
  rawHashrate: number
  total_hashrate: number
  currency: 'BTC' | 'LTC'
}

export const dashboardMiningApi = {
  getHashrateStats: async (currency?: 'BTC' | 'LTC'): Promise<HashrateStats> => {
    const params = currency ? `?currency=${currency}` : ''
    const response = await apiClient.get(`/mining/stats/hashrate${params}`)
    return response.data
  },

  getChartData: async (currency?: 'BTC' | 'LTC', hours: 24 | 168 | 720 = 24): Promise<ChartDataPoint[]> => {
    const params = new URLSearchParams()
    if (currency) params.append('currency', currency)
    params.append('hours', hours.toString())
    const response = await apiClient.get(`/mining/charts/?${params}`)
    return response.data
  }
}