import axios, { Canceler } from '../../src/index'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(function(e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message)
  }
})
// 取消发送，此时network显示是canceled
// setTimeout(() => {
//   source.cancel()
// }, 1000)
// // 这里我们取消之后再次取消，此时这个请求就不会发出，会直接报错，再network上只存在canceled的请求
// setTimeout(() => {
//   source.cancel('Operation canceled by the user.')
//   axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function(e) {
//     if (axios.isCancel(e)) {
//       console.log(e.message)
//     }
//   })
// }, 100)
//
// let cancel: Canceler
//
// axios.get('/cancel/get', {
//   cancelToken: new CancelToken(c => {
//     cancel = c
//   })
// }).catch(function(e) {
//   if (axios.isCancel(e)) {
//     console.log('Request canceled')
//   }
// })
//
// setTimeout(() => {
//   cancel()
// }, 200)
