import axios, { AxiosError } from 'axios'
import { getAccessToken } from './auth'

// baseURL is proxied in dev by Vite; in prod point to real URL via env var
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1'
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (v?: unknown) => void; reject: (err?: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

api.interceptors.request.use(async config => {
  const token = await getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (originalRequest.headers) originalRequest.headers.Authorization = 'Bearer ' + token
            return axios(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = await getAccessToken()
        processQueue(null, token)
        isRefreshing = false
        if (originalRequest.headers) originalRequest.headers.Authorization = 'Bearer ' + token
        return axios(originalRequest)
      } catch (err) {
        processQueue(err, null)
        isRefreshing = false
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default api
