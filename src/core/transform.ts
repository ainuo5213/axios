import { AxiosTransformer } from '../types'

/**
 * 执行transformer的函数，首次执行用于处理header和data
 * @param data
 * @param headers
 * @param fns
 */
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
