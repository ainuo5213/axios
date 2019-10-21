import { AxiosTransformer } from '../types'

/**
 * 执行transformRequest和transformResponse的方法
 * @param data
 * @param headers
 * @param fns
 */
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]) {
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
