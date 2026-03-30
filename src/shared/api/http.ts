import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'

export type ApiError = {
  kind: 'api_error'
  message: string
  status?: number
  url?: string
}

export function toApiError(error: unknown, fallbackMessage: string): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    return {
      kind: 'api_error',
      message: axiosError.message || fallbackMessage,
      status: axiosError.response?.status,
      url: axiosError.config?.url,
    }
  }

  if (error instanceof Error) {
    return { kind: 'api_error', message: error.message || fallbackMessage }
  }

  return { kind: 'api_error', message: fallbackMessage }
}

export function createHttpClient(baseURL?: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      Accept: 'application/json',
    },
  })
}

