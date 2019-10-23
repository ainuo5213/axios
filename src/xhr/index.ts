import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

/**
 * xhr的主函数
 * @param config
 */
export default function index(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout, cancelToken, withCredentials, xsrfHeaderName, xsrfCookieName, onDownloadProgress, onUploadProgress, auth, validateStatus } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)
    configureRequest()
    addEvents()
    processHeaders()
    processCancel()
    request.send(data)

    /**
     * 处理响应
     * @param response
     */
    function handleResponse(response: AxiosResponse): void {
      // 成功的请求
      if (!validateStatus || validateStatus(response.status)) {
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

    /**
     * 配置请求
     */
    function configureRequest(): void {
      // 如果设置了responseType，则设置xhr的responseType
      if (responseType) {
        request.responseType = responseType
      }
      // 超时的时间
      if (timeout) {
        request.timeout = timeout
      }
      // 跨域时，当添加withCredentials之后，会携带请求头里会携带cookie（默认跨域不会携带）
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    /**
     * 添加事件
     */
    function addEvents(): void {
      // 网络异常错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }
      // 超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceed`, config, 'ECONNABORTED', request))
      }
      // 下载进度监控
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      // 上传进度监控
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
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
    }

    /**
     * 处理header
     */
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      // 通过配置的xsrfCookieName和xsrfHeaderName，去取cookie，若取到了，则将cookie以header和cookie的形式发送给服务端
      if (withCredentials || isURLSameOrigin(url!) && xsrfCookieName && xsrfHeaderName) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
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
    }

    /**
     * 处理取消请求
     */
    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(message => {
          request.abort()
          reject(message)
        })
      }
    }
  })
}
