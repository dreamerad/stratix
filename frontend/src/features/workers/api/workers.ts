import { apiClient } from '@/shared/api/client'

export interface Worker {
  worker: string
  hashrate: string
  raw_hashrate: number
  is_active: boolean
  last_seen: number
  coinType: 'BTC' | 'LTC'
}

export interface WorkersResponse {
  workers: Worker[]
}

export const workersApi = {
  getWorkers: async (currency?: 'BTC' | 'LTC'): Promise<WorkersResponse> => {
    const params = currency ? `?currency=${currency}` : ''
    const response = await apiClient.get(`/mining/workers/${params}`)
    return response.data
  }
}