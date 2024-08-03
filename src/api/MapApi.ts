/**
 * @name: MapApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 8/2/2024 10:37 AM
 * @version: 1.0
 */
import instance from '@/api/filter'

const mapApi = ''

export const getAllMapByUserId = (page: number, pageSize: number) => {
  return instance.get(`${mapApi}/map/getAllByUserId?page=${page}&pageSize=${pageSize}`)
}

export const getAllOpenMap = (page?: number, pageSize?: number) => {
  if (page === undefined || pageSize === undefined)
    return instance.get(`${mapApi}/map/getAllOpen`)
  else
    return instance.get(`${mapApi}/map/getAllOpen?page=${page}&pageSize=${pageSize}`)
}

export const addMap = (params: any) => {
  return instance.post(`${mapApi}/map/add`, params)
}

export const delMap = (id: number) => {
  return instance.delete(`${mapApi}/map/del?id=${id}`)
}
