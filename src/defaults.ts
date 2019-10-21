import {
  AxiosRequestConfig,
  Method
} from './types'
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

const defaultConfig: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Application: 'application/json, text/plain, */*'
    }
  },
  transformRequest: [
    function(data: any, headers: any) {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],
  transformResponse: [
    function(data: any) {
      return transformResponse(data)
    }
  ]
}


const methodsWithoutData: Method[] = ['delete', 'get', 'head', 'options']

methodsWithoutData.forEach(method => {
  defaultConfig.headers[method] = {}
})

const methodsWithData: Method[] = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaultConfig

