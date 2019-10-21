let toString = Object.prototype.toString

/**
 * 判断是否是日期对象
 * @param value
 */
export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}

// export function isObject(value: any): value is Object {
//   return value !== null && typeof value === 'object'
// }

/**
 * 判断是否是普通对象
 * @param value
 */
export function isPlainObject(value: any): value is Object {
  return value !== null && toString.call(value) === '[object Object]'
}

/**
 * 扩展from到to，将from的所有属性拷贝到to
 * @param from
 * @param to
 */
export function extend<T, U>(from: T, to: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
/**
 * 深度合并（拷贝）
 * @param args 合并的对象数组
 */
export function deepMerge(...args: any[]): any {
  const result = Object.create(null)

  args.forEach(arg => {
    if (arg) {
      Object.keys(arg).forEach(key => {
        const val = arg[key]
        // 是普通对象时
        if (isPlainObject(val)) {
          // 若判断该属性值是value时，判断该属性在result中存在与否，若存在则将这俩进行深度合并
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            // 若该属性值在result上不存在，则直接对该属性值进行深度合并
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

