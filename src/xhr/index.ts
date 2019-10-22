import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

/**
 * xhr的主函数
 * @param config
 */
export default function index(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()
    // 如果设置了responseType，则设置xhr的responseType
    if (responseType) {
      request.responseType = responseType
    }
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      // status为0时表示未发送请求
      if (request.status === 0) {
        return
      }
      // 设置返回的headers
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      // 判断返回数据：返回的数据依赖于responseType
      const responseData = responseType !== 'text' ? request.response : request.responseText
      // 设置返回的响应格式
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    // 网络异常错误
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }
    // 超时
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request))
    }
    request.open(method.toUpperCase(), url!, true)
    if (timeout) {
      request.timeout = timeout
    }
    // 添加头部要在open后和send前
    Object.keys(headers).forEach(name => {
      // 严谨判断
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
    request.send(data)

    /**
     * 处理请求
     * @param response
     */
    function handleResponse(response: AxiosResponse): void {
      // 成功的请求
      if (response.status >= 200 && response.status <= 300) {
        resolve(response)
        // 失败的请求
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
