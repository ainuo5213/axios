import { AxiosRequestConfig, AxiosResponse } from '../types'

export class AxiosError extends Error {
  public isAxiosError: boolean
  public config: AxiosRequestConfig
  public code?: string | null
  public request?: any
  public response?: AxiosResponse

  constructor(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true
    // ts的坑，必需显示指定
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse): AxiosError {
  return new AxiosError(message, config, code, request, response)
}
