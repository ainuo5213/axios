import { createError } from '../../src/helpers/error'
import { AxiosRequestConfig, AxiosResponse } from '../../src/types'

describe('helpers:error', function() {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const errorNormal = createError('Boom!', config, 'SOMETHING', request, response)
    expect(errorNormal instanceof Error).toBeTruthy()
    expect(errorNormal.message).toBe('Boom!')
    expect(errorNormal.config).toBe(config)
    expect(errorNormal.code).toBe('SOMETHING')
    expect(errorNormal.request).toBe(request)
    expect(errorNormal.response).toBe(response)
    expect(errorNormal.isAxiosError).toBeTruthy()
  })
})
