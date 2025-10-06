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

export interface WorkerHistoryAllDataPoint {
  timestamp: number
  raw_hashrate: number
}

export interface WorkersHistoryAllResponse {
  hours: number
  currency: 'BTC' | 'LTC'
  workers: { [workerName: string]: WorkerHistoryAllDataPoint[] }
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

  getAllWorkersHistory: async (
    hours: number,
    currency: 'BTC' | 'LTC'
  ): Promise<WorkersHistoryAllResponse> => {
    const response = await apiClient.get('/mining/workers/history/all', {
      params: { hours, currency }
    })
    return response.data
  }
}