import {
  Axios,
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  AxiosReponse,
  RejectedFn,
  ResolvedFn,
  Interceptor
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Chain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

/**
 * AxiosManagerr类
 */
export default class AxiosManager implements Axios {
  // 默认配置
  public defaults: AxiosRequestConfig
  // 拦截器
  public interceptor: Interceptor

  constructor(config: AxiosRequestConfig) {
    this.defaults = config
    // 拦截器有请求拦截其和响应拦截器
    this.interceptor = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosReponse>()
    }
  }

  /**
   * 私有请求方法
   * @param method
   * @param url
   * @param config
   * @param data
   * @private
   */
  private _requestWithoutData(method: Method, url: string, config: AxiosRequestConfig, data?: any) {
    return this.request(
      Object.assign(config, {
        method,
        url
      })
    )
  }

  /**
   * delete方法
   * @param url
   * @param config
   */
  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('delete', url, config || {})
  }

  public get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('get', url, config || {})
  }

  public head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('head', url, config || {})
  }

  public options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('options', url, config || {})
  }

  public patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('patch', url, config || {})
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('post', url, config || {}, data)
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestWithoutData('put', url, config || {})
  }

  /**
   * request的两种传参方式
   * @param url
   * @param config
   */
  public request(url: any, config?: any): AxiosPromise {
    // 判断第一个参数是字符串还是对象
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      // 第一个参数是字符串时，转换第一个url为config的url
      config.url = url
    } else {
      config = url
    }
    // 合并默认配置和自定义配置
    config = mergeConfig(this.defaults, config)
    // promise链：resolved函数是派发请求
    const chain: Chain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    // 请求拦截器先添加的后执行
    this.interceptor.request.forEach(item => {
      chain.unshift(item)
    })
    // 响应拦截器先添加的先执行
    this.interceptor.response.forEach(item => {
      chain.push(item)
    })
    // 使config决议为一个promise
    let promise = Promise.resolve(config)
    // 让promise链的所有resolved和rejected都执行
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      // 执行resolved方法即dispatchRequest(config: AxiosRequestConfig)
      promise.then(resolved, rejected)
    }
    return promise
  }
}
