import { AxiosRequestConfig } from '../types'
import { deepMerge, isPlainObject } from '../helpers/util'
// 合并策略的map
const strats = Object.create(null)

/**
 * 默认的合并策略
 * @param defaultValue
 * @param manualValue
 */
function defaultStrat(defaultValue: any, manualValue: any): any {
  return typeof manualValue !== 'undefined' ? manualValue : defaultValue
}

/**
 * 对特定的属性的合并策略
 * @param defaultValue
 * @param manualValue
 */
function fromVal2Strat(defaultValue: any, manualValue: any): any {
  if (typeof manualValue !== 'undefined') {
    return manualValue
  }
}

/**
 *
 * @param defaultValue
 * @param manualValue
 */
function deepMergeStrat(defaultValue: any, manualValue: any): any {
  if (isPlainObject(manualValue)) {
    return deepMerge(defaultValue, manualValue)
  } else if (typeof manualValue !== 'undefined') {
    return manualValue
  } else if (isPlainObject(defaultValue)) {
    return deepMerge(defaultValue)
  } else {
    return defaultValue
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})
/**
 * 合并配置
 * @param defaultConfig
 * @param manualConfig
 */
export default function mergeConfig(defaultConfig: AxiosRequestConfig, manualConfig?: AxiosRequestConfig): AxiosRequestConfig {
  if (!manualConfig) {
    manualConfig = {}
  }

  const config = Object.create(null)

  for (let key in manualConfig) {
    mergeField(key)
  }

  for (let key in defaultConfig) {
    if (!manualConfig[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    // 得到每个属性key的对应的合并策略
    const strat = strats[key] || defaultStrat
    // 合并属性
    config[key] = strat(defaultConfig[key], manualConfig![key])
  }

  return config
}
