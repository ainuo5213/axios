import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 将request取出来，然后给这个实例赋值get、post方法等等
  const instance = Axios.prototype.request.bind(context)
  // 将context的方法等等赋值给instance
  extend(context, instance)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function(config) {
  return createInstance(mergeConfig(defaults, config))
}
export default axios