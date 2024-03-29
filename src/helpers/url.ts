import { isDate, isPlainObject, isURLSearchParams } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 将url和params拼接成完整的url
 * @param url
 * @param params
 * @param paramsSerializer
 */
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
  if (!params) {
    return url
  }

  const parts: string[] = []
  let serializedParams: string = ''
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    Object.keys(params).forEach(key => {
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let values = []
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    serializedParams = parts.join('&')
  }

  const markIndex = url.indexOf('#')
  if (markIndex !== -1) {
    url = url.slice(0, markIndex)
  }
  if (serializedParams === '') {
    url += serializedParams
  } else {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 判断请求的URL和当前浏览器的位置是否同源
 * @param requestURL
 */
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 通过传入的url赋值给a标签的href，然后解构出域名和协议
 * @param url
 */
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode
  return { protocol, host }
}
