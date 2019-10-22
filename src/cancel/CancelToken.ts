import { CancelExecutor, Canceler, CancelTokenSource } from '../types'

import Cancel from './Cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  public promise: Promise<Cancel>
  public reason?: Cancel

  public constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })
    let canceler: Canceler = (message: string | undefined) => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    }
    executor(canceler)
  }

  /**
   * 如果请求取消之后再次发出请求时，抛出异常
   */
  public throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }

  public static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      // 得到cancel方法，当执行cancel方法时，this.promise被决议，当发出请求时会调用then方法进而取消请求的发出
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
