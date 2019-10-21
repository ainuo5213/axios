import { isDate, isPlainObject } from './util'

/**
 * 处理特殊字符
 * @param value
 */
function encode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 构建合法的url
 * @param url
 * @param params
 */
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const value = params[key]
    // value为空或undefined的情况：foo: null => ''
    if (value === undefined || value === null) {
      return
    }
    let values = []
    // value是个数组的情况: foo: ['bar', 'baz'] => foo[]=bar&foo[]=baz
    if (Array.isArray(value)) {
      values = value
      key += '[]'
    } else {
      // 将value变成数组，方便统一处理
      values = [value]
    }
    // 对values数组进行遍历，拼接为query
    values.forEach(value => {
      // 日期的情况: foo: new Date() => foo: isoString
      if (isDate(value)) {
        value = value.toISOString()
        // 对象的情况：{foo: 'bar'} => "foo: 'bar'"
      } else if (isPlainObject(value)) {
        value = JSON.stringify(value)
      }
      parts.push(`${encode(key)} = ${encode(value)}`)
    })
  })
  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 是否有hash
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // 拿到hash之前的url
      url = url.slice(0, markIndex)
    }
    // 拼接为真正的url
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
