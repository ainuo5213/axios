export type Method =
  'GET'
  | 'get'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH';


export interface AxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  responseType?: XMLHttpRequestResponseType,
  headers?: any
}

export interface AxiosReponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosPromise extends Promise<AxiosReponse> {

}


