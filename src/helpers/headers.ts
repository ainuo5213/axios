/**
 * handle headers
 */
import { isPlainObject } from './util'

/**
 * 规范化请求头的名字
 * @param headers
 * @param normalizedName
 */
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    // content-type 和 Content-Type 的一个转换
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      // 设置了新的请求头字段，删除老的字段
      delete headers[name]
    }
  })
}

/**
 * 添加请求头部
 * @param headers
 * @param data
 */
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  // data是普通对象，则对header添加content-type
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type'.toLowerCase()]) {
      headers['Content-Type'] = 'application/json;charset=utf8'
    }
  }
  return headers
}

/**
 * 转换请求头字符串为对象
 * @param headers
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // 每一行的请求头以\r\n结束
  headers.split('\r\n').forEach(oneLine => {
    let [key, value] = oneLine.split(':')
    key = key&& key.trim()
    value = value && value.trim()
    parsed[key] = value
  })
  return parsed
}
