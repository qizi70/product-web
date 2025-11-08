import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant';

const BASE_OK = 200
const SUCCESS_CODE = [BASE_OK]

type FcResponse = {
  code: number
  data?: any
  message: string
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  timeout: 60000,
  withCredentials: false
})

function startLoading() {
  showLoadingToast({
    message: '加载中……',
    forbidClick: true,
    duration: 0 // 持续显示，手动关闭
  })
}

function endLoading() {
  closeToast()
}

const stack: number[] = []
function createDelayLoading(delay = 500) {
  const timer = setTimeout(() => {
    stack.push(timer)
    startLoading()
  }, delay)
  function closeLoading() {
    clearTimeout(timer)
    if (stack.includes(timer)) {
      const index = stack.indexOf(timer)
      stack.splice(index, 1)
      if (stack.length === 0) {
        endLoading()
      }
    }
  }
  return closeLoading
}

// 请求拦截器保持不变
instance.interceptors.request.use(
  (config: any) => {
    config.hideLoading = createDelayLoading(1000)
    // const token = localStorage.getItem('token')
    // if (token && !config.noToken) {
    //   config.headers.token = token;
    // }
    return config
  },
  error => {
    error.config && error.config.hideLoading && error.config.hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器保持不变
instance.interceptors.response.use(
  (response: any) => {
    const code = response.data.code
    const data = response.data
    response.config.hideLoading && response.config.hideLoading()
    return response
  },
  error => {
    console.log('error: ', error)
    error && error.config && error.config.hideLoading && error.config.hideLoading()
    if (error.response) return Promise.reject(error.response.data)
    else return Promise.reject({ message: '请求超时' })
  }
)

export function myGet(url: string, params = {}, options = {}): Promise<FcResponse> {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: params,
        ...options
      })
      .then(
        response => {
          SUCCESS_CODE.includes(response.data.code)
            ? resolve(response.data)
            : reject(response.data)
        },
        err => {
          showToast({
            message: err.message,
            type: 'fail',
            duration: 2000
          })
          reject(err)
        }
      )
  })
}

export function myPost(url: string, data = {}, config = {}): Promise<FcResponse> {
  return new Promise((resolve, reject) => {
    instance.post(url, data, config).then(
      response => {
        SUCCESS_CODE.includes(response.data.code)
          ? resolve(response.data)
          : reject(response.data)
      },
      err => {
        console.log('err: ', err)
        showToast({
          message: err.message,
          type: 'fail',
          duration: 2000
        })
        reject(err)
      }
    )
  })
}

export function myPut(url: string, data = {}, config = {}): Promise<FcResponse> {
  return new Promise((resolve, reject) => {
    instance.put(url, data, config).then(
      response => {
        SUCCESS_CODE.includes(response.data.code)
          ? resolve(response.data)
          : reject(response.data)
      },
      err => {
        showToast({
          message: err.message,
          type: 'fail',
          duration: 2000
        })
        reject(err)
      }
    )
  })
}

export function myDelete(url: string, config: {}): Promise<FcResponse> {
  return new Promise((resolve, reject) => {
    instance.delete(url, config).then(
      response => {
        SUCCESS_CODE.includes(response.data.code)
          ? resolve(response.data)
          : reject(response.data)
      },
      err => {
        showToast({
          message: err.message,
          type: 'fail',
          duration: 2000
        })
        reject(err)
      }
    )
  })
}

export function myPostForm(url: string, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data, config).then(
      response => {
        response.status == 200
          ? resolve(response)
          : reject(response)
      },
      err => {
        reject(err)
      }
    )
  })
}
