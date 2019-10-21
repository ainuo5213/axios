import { Canceler, CancelExecutor, CancelToken, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelTokenMain implements CancelToken {

  public promise: Promise<Cancel>
  public reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    // 当调用then方法时，promise变成决议resolve状态，此时可以通过executor取得this.reason
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    executor(message => {
      if (this.reason) {
        return
      }
      // 得到reason
      this.reason = new Cancel(message)
      // 将这个message返回resolve掉
      resolvePromise(this.reason)
    })
  }

  /**
   * 工厂方法，创建Cancel实例和当前的cancel方法，并将resolve的reason传递给cancel
   */
  public static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelTokenMain(canceler => cancel = canceler)
    return {
      cancel,
      token
    }
  }

  /**
   * 当该请求的cancelToken已经使用过了，当直接抛出错误
   */
  public throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
}
