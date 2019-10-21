import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'
// 策略map
const strats = Object.create(null)
/**
 * 默认的合并策略
 * @param defaultValue default
 * @param manualConfig manual
 */
function defaultStrat(defaultValue: any, manualValue: any): any {
  return typeof manualValue === 'undefined' ? defaultValue : manualValue
}
/**
 * 对maualConfig的合并策略，只要manualValue不为undefined，取manualValue
 * @param defaultValue default
 * @param manualValue manual
 */
function fromVal2Strat(defaultValue: any, manualValue: any): any {
  if (typeof manualValue !== 'undefined') {
    return manualValue
  }
}
/**
 * 深度合并策略
 * @param defaultValue 
 * @param manualValue 
 */
function deepMergeStrat(defaultValue: any, manualValue: any): any {
  // manualValue是普通对象时，对manualValue和defaultValue进行合并
  if (isPlainObject(manualValue)) {
    return deepMerge(defaultValue, manualValue)
    // manualValue不是普通对象和undefined时，直接返回
  } else if (typeof manualValue !== 'undefined') {
    return manualValue
  } else if (isPlainObject(defaultValue)) {
    return deepMerge(defaultValue)
  } else {
    return defaultValue
  }
}
// 需要对manaulValue采取对应合并策略的键
const stratKeysFromVal2 = ['url', 'params', 'data']
// 策略赋值
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})
// 采取深度合并策略的键
const stratKeysDeepMerge = ['headers']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})
/**
 * 合并配置
 * @param defaultConfig 默认配置
 * @param manualConfig 自定义配配置
 */
export default function mergeConfig(defaultConfig: AxiosRequestConfig, manualConfig?: AxiosRequestConfig): AxiosRequestConfig {
  // 自定义配置不存在的情况
  if (!manualConfig) {
    manualConfig = {}
  }
  // 合并之后的配置
  const config = Object.create(null)
  // 对自定义配置执行合并策略
  for (let key in manualConfig) {
    mergeField(key)
  }
  // 对默认配置采取合并策略
  for (let key in defaultConfig) {
    if (!manualConfig[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 如果这个键没有对应的合并策略，则采取默认的合并策略
    const strat = strats[key] || defaultStrat
    // 对对应key的配置采取合并
    config[key] = strat(defaultConfig[key], manualConfig![key])
  }

  return config
}
