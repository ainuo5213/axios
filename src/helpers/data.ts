import { isPlainObject } from './util'

/**
 * 序列化普通对象
 * 因为ajax能send的数据只有
 * Blob、
 * ArrayBuffer、
 * ArrayBufferView、
 * Document、
 * DOMString、
 * FormData
 * @param data
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * 转换响应数据的格式
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
