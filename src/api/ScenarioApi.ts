/**
 * @name: ScenarioApi
 * @description: TODO
 * @author: Lingkai Shi
 * @date: 7/12/2024 9:53 PM
 * @version: 1.0
 */
import instance from '@/api/filter'

const scenarioApi = ''

export const getScenarioById = (id: number) => {
  return instance.get(`${scenarioApi}/scenario/getById?id=${id}`)
}

export const getAllScenario = () => {
  return instance.get(`${scenarioApi}/scenario/getAll`)
}

export const saveScenarioGraphJsonByIdAndType = (id: number, type: string, json: any) => {
  return instance.post(`${scenarioApi}/scenario/saveGraphJsonByIdAndType?id=${id}&type=${type}`, json)
}

export const getScenarioGraphJsonByIdAndType = (id: number, type: string) => {
  return instance.get(`${scenarioApi}/scenario/getGraphJsonByIdAndType?id=${id}&type=${type}`)
}

export const getAllScenarioByProjectId = (id: number) => {
  return instance.get(`${scenarioApi}/scenario/getAllByProjectId?id=${id}`)
}

export const addScenario = (params: any) => {
  return instance.post(`${scenarioApi}/scenario/add`, params)
}

export const batchAddScenario = (params: any) => {
  return instance.post(`${scenarioApi}/scenario/batchAdd`, params)
}

export const editScenario = (params: any) => {
  return instance.post(`${scenarioApi}/scenario/edit`, params)
}

export const batchEditScenario = (params: any) => {
  return instance.post(`${scenarioApi}/scenario/batchEdit`, params)
}

export const delScenario = (id: number) => {
  return instance.delete(`${scenarioApi}/scenario/del?id=${id}`)
}

export const batchDelScenario = (idList: number[]) => {
  return instance.delete(`${scenarioApi}/scenario/batchDel`, { data: idList })
}
