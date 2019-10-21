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
  res.data = transform(res.data, res.headers, res.config.transformRequest)
  return res
}
