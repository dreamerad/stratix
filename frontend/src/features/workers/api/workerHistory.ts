import { apiClient } from '@/shared/api/client'

export interface WorkerHistoryDataPoint {
  timestamp: number
  raw_hashrate: number
  hashrate: string
}

export interface WorkerHistoryResponse {
  worker: string
  hours: number
  data: WorkerHistoryDataPoint[]
  currency: 'BTC' | 'LTC'
}

export const workerHistoryApi = {
  getWorkerHistory: async (
    workerName: string,
    hours: number,
    currency: 'BTC' | 'LTC'
  ): Promise<WorkerHistoryResponse> => {
    const response = await apiClient.get(`/mining/workers/${encodeURIComponent(workerName)}/history`, {
      params: { hours, currency }
    })
    return response.data
  },

  getGroupHistory: async (
    groupName: string,
    hours: number,
    currency: 'BTC' | 'LTC'
  ): Promise<WorkerHistoryResponse> => {
    const response = await apiClient.get('/mining/test', {
      params: { group: groupName, hours, currency }
    })
    return response.data
  }
}