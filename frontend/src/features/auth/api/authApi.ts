import { apiClient } from '@/shared/api/client'

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface ChangeUsernameRequest {
  new_name: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface ChangeUsernameResponse {
  message: string
  name: string
}

export const authProfileApi = {
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await apiClient.put('/auth/change-password', data)
    return response.data
  },

  changeUsername: async (data: ChangeUsernameRequest): Promise<ChangeUsernameResponse> => {
    const response = await apiClient.put('/auth/change-username', data)
    return response.data
  }
}