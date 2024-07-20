/**
 * @name: ResourceApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/17/2024 7:41 PM
 * @version: 1.0
 */
import instance from '@/api/filter'

const resourceApi = ''

export const getAllResourceByUserId = (page: number, pageSize: number) => {
  return instance.get(`${resourceApi}/resource/getAllByUserId?page=${page}&pageSize=${pageSize}`)
}

export const getAllOpenResource = (page: number, pageSize: number) => {
  return instance.get(`${resourceApi}/resource/getAllOpen?page=${page}&pageSize=${pageSize}`)
}

export const uploadResource = (uuidName: string, params: FormData) => {
  instance.defaults.headers['Content-type'] = 'multipart/form-data'

  const fun = instance.post(`${resourceApi}/resource/upload?uuidName=${uuidName}`, params)

  instance.defaults.headers['Content-type'] = 'application/json'

  return fun
}

export const addResource = (params: any) => {
  return instance.post(`${resourceApi}/resource/add`, params)
}
