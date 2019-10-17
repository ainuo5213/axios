import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
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
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

/**
 * URL的转化
 * @param config
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

/**
 * 请求数据的转化
 * @param config
 */
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

/**
 * 请求头的转化
 * @param config
 */
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data = null } = config
  return processHeaders(headers, data)
}

/**
 * 响应数据的转化
 * @param res
 */
function transformResponseData(res: AxiosReponse): AxiosReponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios
