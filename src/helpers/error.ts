import { AxiosRequestConfig, AxiosReponse } from '../types'

class AxiosError extends Error {
  public isAxiosError!: boolean
  public config!: AxiosRequestConfig
  public code?: string | null
  public request?: any
  public response?: AxiosReponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosReponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.response = response
    this.request = request
    this.isAxiosError = true
    // typescript的一个坑，当继承内置对象时，调用方法可能会出异常
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * 工厂模式创建AxiosError对象
 * @param message
 * @param config
 * @param code
 * @param request
 * @param response
 */
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosReponse
): AxiosError {
  return new AxiosError(message, config, code, request, response)
}
