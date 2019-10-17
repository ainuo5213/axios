import { AxiosRequestConfig, AxiosPromise, AxiosReponse } from '../types'
import { parseHeaders } from '../helpers/headers'

/**
 * xhr的主函数
 * @param config
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()
    // 如果设置了responseType，则设置xhr的responseType
    if (responseType) {
      request.responseType = responseType
    }
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      // 设置返回的headers
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      // 判断返回数据：返回的数据依赖于responseType
      const responseData = responseType !== 'text' ? request.response : request.responseText
      // 设置返回的响应格式
      const response: AxiosReponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }
    request.open(method.toUpperCase(), url, true)
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
  })
}
