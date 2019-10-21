import {
  Cancel
} from '../types'

export default class CancelMain implements Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof CancelMain
}
