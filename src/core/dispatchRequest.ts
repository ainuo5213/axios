import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from '../types'
import xhr from '../xhr'
import transform from './transform'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'

/**
 * 派发请求
 * @param config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 首先查看config的token是否使用过，使用过则抛出异常
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res: AxiosReponse) => {
    return transformResponseData(res)
  })
}

/**
 * handle config
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

/**
 * URL的转化
 * @param config
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}

/**
 * 响应数据的转化
 * @param res
 */
function transformResponseData(res: AxiosReponse): AxiosReponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 * 取消请求
 * @param config
 */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  // 如果当前请求配置了cancelToken，则取消
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
