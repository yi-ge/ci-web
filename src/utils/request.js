import axios from 'axios'
import { getToken } from './tool'

const DevBaseUrl = 'http://127.0.0.1:5000'
const ProdBashUrl = 'https://api.wulvshi.com'

export let config = {
  baseURL: process.env.NODE_ENV !== 'production' ? DevBaseUrl : ProdBashUrl
}

let token = getToken()
if (token) {
  config.headers = {Authorization: 'Bearer ' + token}
}

let request = axios.create(config)

axios.interceptors.request.use(
  (config) => {
    if (window) {
      let token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default request
