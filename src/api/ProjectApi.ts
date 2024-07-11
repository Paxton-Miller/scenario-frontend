/**
 * @name: ProjectApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/10/2024 2:44 PM
 * @version: 1.0
 */
import instance from '@/api/filter'
import type { AddRequest } from '@/pages/project/class/Project'

const projectApi = ''

export const getAllProject = (page: number, pageSize: number) => {
  if (page === undefined || pageSize === undefined)
    return instance.get(`${projectApi}/project/getAll`)
  else
    return instance.get(`${projectApi}/project/getAll?page=${page}&pageSize=${pageSize}`)
}

export const getProjectById = (id: number) => {
  return instance.get(`${projectApi}/project/getById?id=${id}`)
}

export const addProject = (params: AddRequest) => {
  return instance.post(`${projectApi}/project/add`, params)
}
