// 导入axios
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建一个axios实例
const instance = axios.create({
  baseURL: 'http://localhost:8898',

  headers: {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'application/json',
  },

  // withCredentials: true,
  timeout: 500000, // 500秒
})

// http 拦截器

const reqOnFulfilled = (config: any) => {
  const token = localStorage.getItem('token')
  if (token)
    config.headers.Authorization = token

  return config
}

const reqOnRejected = (error: any) => {
  return Promise.reject(error)
}

instance.interceptors.request.use(reqOnFulfilled, reqOnRejected)

const resOnFulfilled = (response: any) => {
  const { data: res } = response

  // 拦截请求，统一相应
  if (res.code === 200) {
    return res.data === null ? true : res.data
  }
  else {
    ElMessage.warning(res.message)

    return res.data
  }
}

const resOnRejected = (error: any) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        ElMessage.warning('Access Denied!')
        break
      case 404:
        ElMessage.warning('The interface does not exist, do check the interface address.')
        break
      case 500:
        ElMessage.warning('Internal server error, please contact with the administrator.')
        break
      default:
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    }
  }
  else {
    ElMessage.error('CORS Block')
  }
}

instance.interceptors.response.use(resOnFulfilled, resOnRejected)
export default instance
