import InterceptorManager from '../core/InterceptorManager'

export type Method =
  | 'GET'
  | 'get'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  responseType?: XMLHttpRequestResponseType
  headers?: any
  timeout?: number

  [prooName: string]: any

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface AxiosReponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosReponse<T>> {
}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  code?: string | null
  request: any
  response: AxiosReponse
  isAxiosError: boolean
}

export interface Interceptor {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosReponse>
}

export interface Interceptors<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export interface Axios {
  defaults: AxiosRequestConfig
  interceptor: Interceptor

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInterceptorsManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T> {
  (value: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}
