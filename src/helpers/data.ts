/**
 * handle request and response
 */
import { isPlainObject } from '../helpers/util'

/**
 * 默认情况下，send只支持下列数据格式的数据
 *  ArrayBuffer
 *  ArrayBufferView
 *  Blob Document
 *  DOMString
 *  FormData
 *  所以我们需要对普通对象转换，将其转换成序列化的字符串
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 尝试转换响应的数据为JSON对象
 * @param data
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }
  }
  return data
}
