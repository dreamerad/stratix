import { apiClient } from '@/shared/api/client'

export interface ProxyFee {
  pool: string
  worker: string
  pass: string
  percent: number
  window_min: number
  window_max: number
}

export interface ProxyCustomConfig {
  premium_user?: number
  standard_user?: number
  trial_user?: number
  free_account: number
}

export interface ProxyDebugConfig {
  fee: ProxyFee[]
  custom: ProxyCustomConfig
  account_fees: Record<string, ProxyFee[]>
}

export interface ProxyStratumConfig {
  debug: ProxyDebugConfig
}

export interface ProxyConfig {
  'sha256-stratum': ProxyStratumConfig
}

export interface Proxy {
  proxy_id: string
  config: ProxyConfig
  created_at: string
  updated_at: string
  status: 'active' | 'inactive'
}

export interface ProxyStats {
  _id: string | null
  total: number
  active: number
  inactive: number
}

export interface ProxyResponse {
  proxies: Proxy[]
  stats: ProxyStats
  total: number
}

export const proxiesApi = {
  getProxies: async (): Promise<ProxyResponse> => {
    const response = await apiClient.get('/mining/proxies')
    return response.data
  },

  updateProxyStatus: async (proxyId: string, status: 'active' | 'inactive'): Promise<boolean> => {
    const response = await apiClient.patch(`/mining/proxies/${proxyId}/status`, { status })
    return response.status === 200
  },

  deleteProxy: async (proxyId: string): Promise<{ success: boolean; proxy_id: string }> => {
    const response = await apiClient.delete(`/mining/proxies/${proxyId}`)
    return response.data
  }
}