
const toString = Object.prototype.toString

/**
 * 判断对象是否是日期对象
 * @param val
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

/**
 * 判断对象是否是普通对戏
 * @param val
 */
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

/**
 * 将from的所有属性拷贝到to
 * @param to
 * @param from
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

/**
 * 对传入的参数进行深度合并
 * @param objs
 */
export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })

  return result
}

/**
 * 判断传递的数据是不是FormData
 * @param value
 */
export function isFormData(value: any): value is FormData {
  return typeof value !== 'undefined' && value instanceof FormData
}

/**
 * 判断params是不是URLSearchParams类型
 * @param params
 */
export function isURLSearchParams(params: any): params is URLSearchParams {
  return typeof params !== 'undefined' && params instanceof URLSearchParams
}
