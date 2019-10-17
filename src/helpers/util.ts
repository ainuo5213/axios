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
