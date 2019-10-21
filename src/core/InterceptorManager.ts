import { AxiosInterceptorsManager, ResolvedFn, RejectedFn, Interceptors} from '../types'


export default class InterceptorManager<T> implements AxiosInterceptorsManager<T> {
  private readonly interceptors: Array<Interceptors<T> | null>

  constructor() {
    // 拦截器的数组
    this.interceptors = []
  }

  /**
   * 删除某个拦截器
   * @param id 拦截器的id
   */
  public eject(id: number): void {
    // 不能用splice，不然会改变对应拦截器的id
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  /**
   * 使用拦截器
   * @param resolved 成功的回调
   * @param rejected 失败的回调，可选
   */
  public use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  /**
   * 遍历拦截器，执行相应的方法
   * @param fn
   */
  public forEach(fn: (interceptor: Interceptors<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor) {
        fn(interceptor)
      }
    })
  }
}
