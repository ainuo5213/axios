import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123
//
// axios({
//   url: '/config/post',
//   method: 'post',
//   data:{
//     a: 1
//   },
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
//   console.log(res.data)
// })
//
// axios({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log('sad')
// })

const instance = axios.create({
  headers: {
    Authorization: "ASIUOFHSF"
  }
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
})
